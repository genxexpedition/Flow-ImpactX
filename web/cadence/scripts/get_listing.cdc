import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import NFTStorefrontV2 from 0xNFTStorefront
import ImpactXItems from 0xImpactXItems

pub struct ListingItem {
    pub let name: String
    pub let description: String
    pub let image: String

    pub let itemID: UInt64
    pub let resourceID: UInt64
    pub let kind: ImpactXItems.Kind
    pub let rarity: ImpactXItems.Rarity
    pub let owner: Address
    pub let price: UFix64

    init(
        name: String,
        description: String,
        image: String,
        itemID: UInt64,
        resourceID: UInt64,
        kind: ImpactXItems.Kind,
        rarity: ImpactXItems.Rarity,
        owner: Address,
        price: UFix64
    ) {
        self.name = name
        self.description = description
        self.image = image

        self.itemID = itemID
        self.resourceID = resourceID
        self.kind = kind
        self.rarity = rarity
        self.owner = owner
        self.price = price
    }
}

pub fun main(address: Address, listingResourceID: UInt64): ListingItem? {
    if let storefrontRef = getAccount(address).getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath).borrow() {

        if let listing = storefrontRef.borrowListing(listingResourceID: listingResourceID) {

            let details = listing.getDetails()

            let itemID = details.nftID
            let itemPrice = details.salePrice

            if let collection = getAccount(address).getCapability<&ImpactXItems.Collection{NonFungibleToken.CollectionPublic, ImpactXItems.ImpactXItemsCollectionPublic}>(ImpactXItems.CollectionPublicPath).borrow() {

                if let item = collection.borrowImpactXItem(id: itemID) {

                    if let view = item.resolveView(Type<MetadataViews.Display>()) {

                        let display = view as! MetadataViews.Display

                        let owner: Address = item.owner!.address!

                        let ipfsThumbnail = display.thumbnail as! MetadataViews.IPFSFile

                        return ListingItem(
                            name: display.name,
                            description: display.description,
                            image: item.imageCID(),
                            itemID: itemID,
                            resourceID: item.uuid,
                            kind: item.kind,
                            rarity: item.rarity,
                            owner: address,
                            price: itemPrice
                        )
                    }
                }
            }
        }
    }

    return nil
}