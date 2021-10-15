export const CREATE_COLLECTION = `
  import MyWArt from 0xMyWArtContract
  import NonFungibleToken from 0xNonFungibleTokenContract  

  transaction {

    prepare(acct: AuthAccount) {

      let collection <- MyWArt.createEmptyCollection()
      acct.save<@MyWArt.Collection>(<-collection, to: MyWArt.MyWArtCollectionStoragePath)

      acct.link<&{NonFungibleToken.CollectionPublic}>(MyWArt.MyWArtCollectionPublicPath, target: MyWArt.MyWArtCollectionStoragePath)

      acct.link<&{MyWArt.Data}>(MyWArt.MyWArtDataPublicPath, target: MyWArt.MyWArtCollectionStoragePath)

    }
  }
`