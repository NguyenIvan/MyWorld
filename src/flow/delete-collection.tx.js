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