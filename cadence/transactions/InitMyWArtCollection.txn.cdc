import MyWArt from "../contracts/MyWArt.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc" 

transaction(){

    prepare(acct: AuthAccount) {
        if acct.borrow<&MyWArt.Collection>(from: MyWArt.MyWArtCollectionStoragePath) == nil {

            // Put a new Collection in storage
            acct.save<@MyWArt.Collection>(
                <- MyWArt.createEmptyCollection(), 
                to: MyWArt.MyWArtCollectionStoragePath
            )

            // Create a public capability for the Collection
            acct.link<&{NonFungibleToken.CollectionPublic}>(
                MyWArt.MyWArtCollectionPublicPath, 
                target: MyWArt.MyWArtCollectionStoragePath
            )

        }

    }

}