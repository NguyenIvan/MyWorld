export const CREATE_COLLECTION = `
  import MyWorldContract from 0xMyWorld
  
  transaction {
    prepare(acct: AuthAccount) {
      let collection <- MyWorldContract.createEmptyCollection()
      acct.save<@MyWorldContract.Collection>(<-collection, to: MyWorldContract.CollectionStoragePath)
      acct.link<&{MyWorldContract.CollectionPublic}>(MyWorldContract.CollectionPublicPath, target: MyWorldContract.CollectionStoragePath)
    }
  }
`
//   import DappyContract from 0xDappy
  
//   transaction {
//     prepare(acct: AuthAccount) {
//       let collection <- DappyContract.createEmptyCollection()
//       acct.save<@DappyContract.Collection>(<-collection, to: DappyContract.CollectionStoragePath)
//       acct.link<&{DappyContract.CollectionPublic}>(DappyContract.CollectionPublicPath, target: DappyContract.CollectionStoragePath)
//     }
//   }
// `