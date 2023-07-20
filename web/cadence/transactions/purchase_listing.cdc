import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import FlowToken from 0xFlowToken
import ImpactXItems from 0xImpactXItems
import NFTStorefrontV2 from 0xNFTStorefront

pub fun getOrCreateCollection(account: AuthAccount): &ImpactXItems.Collection{NonFungibleToken.Receiver} {
  if let collectionRef = account.borrow<&ImpactXItems.Collection>(from: ImpactXItems.CollectionStoragePath) {
    return collectionRef
  }

  // create a new empty collection
  let collection <- ImpactXItems.createEmptyCollection() as! @ImpactXItems.Collection

  let collectionRef = &collection as &ImpactXItems.Collection
  
  // save it to the account
  account.save(<-collection, to: ImpactXItems.CollectionStoragePath)

  // create a public capability for the collection
  account.link<&ImpactXItems.Collection{NonFungibleToken.CollectionPublic, ImpactXItems.ImpactXItemsCollectionPublic}>(ImpactXItems.CollectionPublicPath, target: ImpactXItems.CollectionStoragePath)

  return collectionRef
}

transaction(listingResourceID: UInt64, storefrontAddress: Address) {
  let paymentVault: @FungibleToken.Vault
  let ImpactXItemsCollection: &ImpactXItems.Collection{NonFungibleToken.Receiver}
  let storefront: &NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}
  let listing: &NFTStorefrontV2.Listing{NFTStorefrontV2.ListingPublic}

  prepare(account: AuthAccount) {
    // Access the storefront public resource of the seller to purchase the listing.
    self.storefront = getAccount(storefrontAddress)
      .getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(
          NFTStorefrontV2.StorefrontPublicPath
      )!
      .borrow()
      ?? panic("Could not borrow Storefront from provided address")

    // Borrow the listing
    self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID) ?? panic("No Offer with that ID in Storefront")
    let price = self.listing.getDetails().salePrice

    // Access the vault of the buyer to pay the sale price of the listing.
    let mainFlowVault = account.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) ?? panic("Cannot borrow FlowToken vault from account storage")
    self.paymentVault <- mainFlowVault.withdraw(amount: price)
    
    self.ImpactXItemsCollection = getOrCreateCollection(account: account)
  }

  execute {
    let item <- self.listing.purchase(
      payment: <-self.paymentVault,
      commissionRecipient: nil
    )

    self.ImpactXItemsCollection.deposit(token: <-item)
    self.storefront.cleanupPurchasedListings(listingResourceID: listingResourceID)
  }
}
