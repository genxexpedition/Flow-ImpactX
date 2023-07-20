import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import ImpactXItems from 0xImpactXItems

pub struct ImpactXItem {
  pub let name: String
  pub let description: String
  pub let image: String

  pub let itemID: UInt64
  pub let resourceID: UInt64
  pub let kind: ImpactXItems.Kind
  pub let rarity: ImpactXItems.Rarity
  pub let owner: Address

  init(
    name: String,
    description: String,
    image: String,
    itemID: UInt64,
    resourceID: UInt64,
    kind: ImpactXItems.Kind,
    rarity: ImpactXItems.Rarity,
    owner: Address,
  ) {
    self.name = name
    self.description = description
    self.image = image

    self.itemID = itemID
    self.resourceID = resourceID
    self.kind = kind
    self.rarity = rarity
    self.owner = owner
  }
}

pub fun fetch(address: Address, itemID: UInt64): ImpactXItem? {
  if let collection = getAccount(address).getCapability<&ImpactXItems.Collection{NonFungibleToken.CollectionPublic, ImpactXItems.ImpactXItemsCollectionPublic}>(ImpactXItems.CollectionPublicPath).borrow() {

    if let item = collection.borrowImpactXItem(id: itemID) {

      if let view = item.resolveView(Type<MetadataViews.Display>()) {

        let display = view as! MetadataViews.Display

        let owner: Address = item.owner!.address!

        let ipfsThumbnail = display.thumbnail as! MetadataViews.IPFSFile

        return ImpactXItem(
          name: display.name,
          description: display.description,
          image: item.imageCID(),
          itemID: itemID,
          resourceID: item.uuid,
          kind: item.kind,
          rarity: item.rarity,
          owner: address,
        )
      }
    }
  }

  return nil
}

pub fun main(keys: [String], addresses: [Address], ids: [UInt64]): {String: ImpactXItem?} {
  let r: {String: ImpactXItem?} = {}
  var i = 0
  while i < keys.length {
    let key = keys[i]
    let address = addresses[i]
    let id = ids[i]
    r[key] = fetch(address: address, itemID: id)
    i = i + 1
  }
  return r
}