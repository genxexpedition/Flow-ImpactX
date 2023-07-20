import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import ImpactXItems from 0xImpactXItems
import NFTStorefrontV2 from 0xNFTStorefront

pub fun hasItems(_ address: Address): Bool {
  return getAccount(address)
    .getCapability<&ImpactXItems.Collection{NonFungibleToken.CollectionPublic, ImpactXItems.ImpactXItemsCollectionPublic}>(ImpactXItems.CollectionPublicPath)
    .check()
}

pub fun hasStorefront(_ address: Address): Bool {
  return getAccount(address)
    .getCapability<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath)
    .check()
}

transaction {
  prepare(acct: AuthAccount) {
    if !hasItems(acct.address) {
      if acct.borrow<&ImpactXItems.Collection>(from: ImpactXItems.CollectionStoragePath) == nil {
        acct.save(<-ImpactXItems.createEmptyCollection(), to: ImpactXItems.CollectionStoragePath)
      }

      acct.unlink(ImpactXItems.CollectionPublicPath)

      acct.link<&ImpactXItems.Collection{NonFungibleToken.CollectionPublic, ImpactXItems.ImpactXItemsCollectionPublic}>(ImpactXItems.CollectionPublicPath, target: ImpactXItems.CollectionStoragePath)
    }

    if !hasStorefront(acct.address) {
      if acct.borrow<&NFTStorefrontV2.Storefront>(from: NFTStorefrontV2.StorefrontStoragePath) == nil {
        acct.save(<-NFTStorefrontV2.createStorefront(), to: NFTStorefrontV2.StorefrontStoragePath)
      }

      acct.unlink(NFTStorefrontV2.StorefrontPublicPath)
      
      acct.link<&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}>(NFTStorefrontV2.StorefrontPublicPath, target: NFTStorefrontV2.StorefrontStoragePath)
    }
  }
}