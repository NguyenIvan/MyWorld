export const DELETE_COLLECTION = `
  import MyWorldContract from 0xMyWorld

  transaction() {
    prepare(acct: AuthAccount) {
      let collectionRef <- acct.load<@MyWorldContract.Collection>(from: MyWorldContract.CollectionStoragePath)
        ?? panic("Could not borrow collection reference")
      destroy collectionRef
      acct.unlink(MyWorldContract.CollectionPublicPath)
    }
  }
`
//   import DappyContract from 0xDappy

//   transaction() {
//     prepare(acct: AuthAccount) {
//       let collectionRef <- acct.load<@DappyContract.Collection>(from: DappyContract.CollectionStoragePath)
//         ?? panic("Could not borrow collection reference")
//       destroy collectionRef
//       acct.unlink(DappyContract.CollectionPublicPath)
//     }
//   }
// `