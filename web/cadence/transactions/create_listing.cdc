import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import FlowToken from 0xFlowToken
import ImpactXItems from 0xImpactXItems
import NFTStorefrontV2 from 0xNFTStorefront

pub fun getOrCreateStorefront(account: AuthAccount): &NFTStorefrontV2.Storefront {
  if let storefrontRef = account.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath) {
    return storefrontRef
  }

  let storefront <- NFTStorefrontV2.createStorefront()

  let storefrontRef = &storefront as &NFTStorefrontV2.Storefront

  account.save(<-storefront, to: NFTStorefrontV2.StorefrontStoragePath)

  account.link<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath, target: NFTStorefrontV2.StorefrontStoragePath)

  return storefrontRef
}

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

  let flowReceiver: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
  let ImpactXItemsProvider: Capability<&ImpactXItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
  let storefront: &NFTStorefrontV2.Storefront

  prepare(account: AuthAccount) {
    // We need a provider capability, but one is not provided by default so we create one if needed.
    let ImpactXItemsCollectionProviderPrivatePath = /private/ImpactXItemsCollectionProviderV14

    self.flowReceiver = account.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)!

    assert(self.flowReceiver.borrow() != nil, message: "Missing or mis-typed FLOW receiver")

    if !account.getCapability<&ImpactXItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(ImpactXItemsCollectionProviderPrivatePath)!.check() {
      account.link<&ImpactXItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(ImpactXItemsCollectionProviderPrivatePath, target: ImpactXItems.CollectionStoragePath)
    }

    self.ImpactXItemsProvider = account.getCapability<&ImpactXItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(ImpactXItemsCollectionProviderPrivatePath)!

    assert(self.ImpactXItemsProvider.borrow() != nil, message: "Missing or mis-typed ImpactXItems.Collection provider")

    self.storefront = getOrCreateStorefront(account: account)
  }

  execute {
    let saleCut = NFTStorefrontV2.SaleCut(
      receiver: self.flowReceiver,
      amount: saleItemPrice
    )

    self.storefront.createListing(
      nftProviderCapability: self.ImpactXItemsProvider,
      nftType: Type<@ImpactXItems.NFT>(),
      nftID: saleItemID,
      salePaymentVaultType: Type<@FlowToken.Vault>(),
      saleCuts: [saleCut],
      marketplacesCapability: nil, // [Capability<&{FungibleToken.Receiver}>]?
      customID: nil, // String?
      commissionAmount: UFix64(0),
      expiry: UInt64(getCurrentBlock().timestamp) + UInt64(500)
    )
  }
}