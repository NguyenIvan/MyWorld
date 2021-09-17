import MyWorldContract from "../contracts/MyWorldContract.cdc"
import FUSD from "../contracts/FUSD.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"


transaction(name: String, price: UFix64, uri:String) {
  let receiverReference: &MyWorldContract.Collection{MyWorldContract.Receiver}
  let sentVault: @FungibleToken.Vault

  prepare(acct: AuthAccount) {
    self.receiverReference = acct.borrow<&MyWorldContract.Collection>(from: MyWorldContract.CollectionStoragePath) 
        ?? panic("Cannot borrow")
    let vaultRef = acct.borrow<&FUSD.Vault>(from: /storage/fusdVault) ?? panic("Could not borrow FUSD vault")
    self.sentVault <- vaultRef.withdraw(amount: price)
  }

  execute {
    let newMyArt <- MyWorldContract.mintMyArt(artData: MyWorldContract.MyArtData(name: name, price: price, uri:uri), paymentVault: <-self.sentVault)
    self.receiverReference.deposit(token: <-newMyArt)
  }
}

/*
The Contract doesn't care anything else but a collection ref and a vault, which is withdraw from AuthAccount's FUSD Vault ref. If the two conditions are satisfied, it will mint an Art, the only extra piece of code this transaction do is to deposit that Art to the above collection ref. 
 */