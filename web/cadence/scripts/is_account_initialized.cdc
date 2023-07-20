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

pub fun main(address: Address): {String: Bool} {
  let ret: {String: Bool} = {}
  ret["ImpactXItems"] = hasItems(address)
  ret["ImpactXItemsMarket"] = hasStorefront(address)
  return ret
}