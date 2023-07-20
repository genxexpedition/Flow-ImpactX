import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import ImpactXItems from "../../contracts/ImpactXItems.cdc"

// This script returns the size of an account's ImpactXItems collection.

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account.getCapability(ImpactXItems.CollectionPublicPath)!
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}
