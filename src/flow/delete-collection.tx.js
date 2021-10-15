export const DELETE_COLLECTION = `
  import MyWArt from 0xMyWArtContract

  transaction () {

    let account: AuthAccount

    prepare(acct: AuthAccount) { 

      let collectionRef = acct.borrow<&MyWArt.Collection>(from: MyWArt.MyWArtCollectionStoragePath)
        ?? panic("Could not borrow collection reference")
      self.account = acct
    }

    execute {

      let collection <- self.account.load<@MyWArt.Collection>(from: MyWArt.MyWArtCollectionStoragePath)
        ?? panic("Could not borrow collection reference")

      destroy collection
        
      self.account.unlink(MyWArt.MyWArtCollectionPublicPath)

      self.account.unlink(MyWArt.MyWArtDataPublicPath)

    }

  }  
`