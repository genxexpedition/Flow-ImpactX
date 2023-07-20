import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import ImpactXItems from "../../contracts/ImpactXItems.cdc"
import MetadataViews from "../../contracts/MetadataViews.cdc"

// This transaction configures an account to hold Flow-ImpactX.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&ImpactXItems.Collection>(from: ImpactXItems.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- ImpactXItems.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: ImpactXItems.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&ImpactXItems.Collection{NonFungibleToken.CollectionPublic, ImpactXItems.ImpactXItemsCollectionPublic, MetadataViews.ResolverCollection}>(ImpactXItems.CollectionPublicPath, target: ImpactXItems.CollectionStoragePath)
        }
    }
}
