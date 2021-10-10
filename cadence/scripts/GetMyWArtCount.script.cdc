import MyWArt from "../contracts/MyWArt.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"

// Returns: UInt64
// First id from MyWArtCollection

pub fun main(address: Address): UInt64 {

    let account = getAccount(address)

    let collectionRef = account.getCapability(MyWArt.MyWArtCollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()!
    
    let id = collectionRef.getIDs()[0]

    log("********************************")
    log(collectionRef)
    log(id)
    log("********************************")

    return id
   
}