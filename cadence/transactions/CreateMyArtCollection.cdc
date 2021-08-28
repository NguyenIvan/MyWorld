import MyWorldContract from "../contracts/MyWorldContract.cdc"

transaction {
  prepare(acct: AuthAccount) {
    let collection <- MyWorldContract.createEmptyCollection()
    acct.save<@MyWorldContract.Collection>(<-collection, to: MyWorldContract.CollectionStoragePath)
    acct.link<&{MyWorldContract.CollectionPublic}>(MyWorldContract.CollectionPublicPath, target: MyWorldContract.CollectionStoragePath)
  }
}