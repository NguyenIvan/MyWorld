import MyWorldContract from "../contracts/MyWorldContract.cdc"
import FUSD from "../contracts/FUSD.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"


transaction(name: String, price: UFix64) {
  let receiverReference: &MyWorldContract.Collection{MyWorldContract.Receiver}
  let sentVault: @FungibleToken.Vault

  prepare(acct: AuthAccount) {
    self.receiverReference = acct.borrow<&MyWorldContract.Collection>(from: MyWorldContract.CollectionStoragePath) 
        ?? panic("Cannot borrow")
    let vaultRef = acct.borrow<&FUSD.Vault>(from: /storage/fusdVault) ?? panic("Could not borrow FUSD vault")
    self.sentVault <- vaultRef.withdraw(amount: price)
  }

  execute {
    let newMyArt <- MyWorldContract.mintMyArt(artData: MyWorldContract.MyArtData(name: name, price: price), paymentVault: <-self.sentVault)
    self.receiverReference.deposit(token: <-newMyArt)
  }
}