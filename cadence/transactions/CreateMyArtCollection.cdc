import MyWorldContract from "../contracts/MyWorldContract.cdc"

transaction {
  let account: AuthAccount

  prepare(acct: AuthAccount) {
    self.account = acct
  }

  execute {
    let collection <- MyWorldContract.createEmptyCollection()
    self.account.save<@MyWorldContract.Collection>
      (<-collection, to: MyWorldContract.CollectionStoragePath)
    self.account.link<&{MyWorldContract.CollectionPublic}>
      (MyWorldContract.CollectionPublicPath, target: MyWorldContract.CollectionStoragePath)
  }
  
}