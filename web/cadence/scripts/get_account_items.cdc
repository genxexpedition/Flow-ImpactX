import NonFungibleToken from 0xNonFungibleToken
import ImpactXItems from 0xImpactXItems

pub fun main(address: Address): [UInt64] {
  if let collection = getAccount(address).getCapability<&ImpactXItems.Collection{NonFungibleToken.CollectionPublic, ImpactXItems.ImpactXItemsCollectionPublic}>(ImpactXItems.CollectionPublicPath).borrow() {
    return collection.getIDs()
  }

  return []
}