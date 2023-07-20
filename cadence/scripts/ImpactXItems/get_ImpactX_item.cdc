import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import MetadataViews from "../../contracts/MetadataViews.cdc"
import ImpactXItems from "../../contracts/ImpactXItems.cdc"

pub struct ImpactXItem {
    pub let name: String
    pub let description: String
    pub let thumbnail: String

    pub let itemID: UInt64
    pub let resourceID: UInt64
    pub let kind: ImpactXItems.Kind
    pub let rarity: ImpactXItems.Rarity
    pub let owner: Address

    init(
        name: String,
        description: String,
        thumbnail: String,
        itemID: UInt64,
        resourceID: UInt64,
        kind: ImpactXItems.Kind,
        rarity: ImpactXItems.Rarity,
        owner: Address,
    ) {
        self.name = name
        self.description = description
        self.thumbnail = thumbnail

        self.itemID = itemID
        self.resourceID = resourceID
        self.kind = kind
        self.rarity = rarity
        self.owner = owner
    }
}

pub fun dwebURL(_ file: MetadataViews.IPFSFile): String {
    var url = "https://"
        .concat(file.cid)
        .concat(".ipfs.dweb.link/")
    
    if let path = file.path {
        return url.concat(path)
    }
    
    return url
}

pub fun main(address: Address, itemID: UInt64): ImpactXItem? {
    if let collection = getAccount(address).getCapability<&ImpactXItems.Collection{NonFungibleToken.CollectionPublic, ImpactXItems.ImpactXItemsCollectionPublic}>(ImpactXItems.CollectionPublicPath).borrow() {
        
        if let item = collection.borrowImpactXItem(id: itemID) {

            if let view = item.resolveView(Type<MetadataViews.Display>()) {

                let display = view as! MetadataViews.Display
                
                let owner: Address = item.owner!.address!

                let ipfsThumbnail = display.thumbnail as! MetadataViews.IPFSFile     

                return ImpactXItem(
                    name: display.name,
                    description: display.description,
                    thumbnail: dwebURL(ipfsThumbnail),
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
