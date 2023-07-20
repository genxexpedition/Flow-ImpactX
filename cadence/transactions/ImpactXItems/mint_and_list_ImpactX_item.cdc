import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import ImpactXItems from "../../contracts/ImpactXItems.cdc"
import FungibleToken from "../../contracts/FungibleToken.cdc"
import FlowToken from "../../contracts/FlowToken.cdc"
//import MetadataViews from "../../contracts/MetadataViews.cdc"
import NFTStorefrontV2 from "../../contracts/NFTStorefrontV2.cdc"

// This transction uses the NFTMinter resource to mint a new NFT.

transaction(recipient: Address, kind: UInt8, rarity: UInt8) {
    // Mint

    // local variable for storing the minter reference
    let minter: &ImpactXItems.NFTMinter

    /// Reference to the receiver's collection
    let recipientCollectionRef: &{NonFungibleToken.CollectionPublic}

    /// Previous NFT ID before the transaction executes
    let mintingIDBefore: UInt64

    // List
    let flowReceiver: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
    let ImpactXItemsProvider: Capability<&ImpactXItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefrontV2.Storefront
    var saleCuts: [NFTStorefrontV2.SaleCut]
    var marketplacesCapability: [Capability<&AnyResource{FungibleToken.Receiver}>]

    prepare(signer: AuthAccount) {
        // Prepare to mint
        self.mintingIDBefore = ImpactXItems.totalSupply

        // Borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&ImpactXItems.NFTMinter>(from: ImpactXItems.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")

        // Borrow the recipient's public NFT collection reference
        self.recipientCollectionRef = getAccount(recipient)
            .getCapability(ImpactXItems.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        // Prepare to list
        self.saleCuts = []
        self.marketplacesCapability = []

        // We need a provider capability, but one is not provided by default so we create one if needed.
        let ImpactXItemsCollectionProviderPrivatePath = /private/ImpactXItemsCollectionProviderV14

        // Receiver for the sale cut.
        self.flowReceiver = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
        
        assert(self.flowReceiver.borrow() != nil, message: "Missing or mis-typed FLOW receiver")

        // Check if the Provider capability exists or not if `no` then create a new link for the same.
        if !signer.getCapability<&ImpactXItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(ImpactXItemsCollectionProviderPrivatePath)!.check() {
            signer.link<&ImpactXItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(ImpactXItemsCollectionProviderPrivatePath, target: ImpactXItems.CollectionStoragePath)
        }

        self.ImpactXItemsProvider = signer.getCapability<&ImpactXItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(ImpactXItemsCollectionProviderPrivatePath)!

        assert(self.ImpactXItemsProvider.borrow() != nil, message: "Missing or mis-typed ImpactXItems.Collection provider")

        self.storefront = signer.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefrontV2 Storefront")
    }

    execute {
        // Execute to mint
        let kindValue = ImpactXItems.Kind(rawValue: kind) ?? panic("invalid kind")
        let rarityValue = ImpactXItems.Rarity(rawValue: rarity) ?? panic("invalid rarity")

        // mint the NFT and deposit it to the recipient's collection
        self.minter.mintNFT(
            recipient: self.recipientCollectionRef,
            kind: kindValue,
            rarity: rarityValue,
            royalties: []
        )

        var totalRoyaltyCut = 0.0
        let effectiveSaleItemPrice = ImpactXItems.getItemPrice(rarity: rarityValue) // commission amount is 0

        // Skip this step - Check whether the NFT implements the MetadataResolver or not.

        // Append the cut for the seller
        self.saleCuts.append(NFTStorefrontV2.SaleCut(
            receiver: self.flowReceiver,
            amount: effectiveSaleItemPrice - totalRoyaltyCut
        ))
        
        // Execute to create listing
        self.storefront.createListing(
            nftProviderCapability: self.ImpactXItemsProvider,
            nftType: Type<@ImpactXItems.NFT>(),
            nftID: ImpactXItems.totalSupply - 1,
            salePaymentVaultType: Type<@FlowToken.Vault>(),
            saleCuts: self.saleCuts,
            marketplacesCapability: self.marketplacesCapability.length == 0 ? nil : self.marketplacesCapability,
            customID: nil,
            commissionAmount: UFix64(0),
            expiry: UInt64(getCurrentBlock().timestamp) + UInt64(500)
        )
    }

    post {
        self.recipientCollectionRef.getIDs().contains(self.mintingIDBefore): "The next NFT ID should have been minted and delivered"
        ImpactXItems.totalSupply == self.mintingIDBefore + 1: "The total supply should have been increased by 1"
    }
}
 