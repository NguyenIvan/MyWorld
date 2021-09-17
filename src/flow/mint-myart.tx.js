export const MINT_MYART = `
import MyWorldContract from 0xMyWorld
import FUSD from 0xFUSD
import FungibleToken from 0xFungibleToken

transaction(name: String, price: UFix64, uri: String) {
  let receiverReference: &MyWorldContract.Collection{MyWorldContract.Receiver}
  let vaultRef: &FUSD.Vault

  prepare(acct: AuthAccount) {

    self.receiverReference = acct.borrow<&MyWorldContract.Collection>(from: MyWorldContract.CollectionStoragePath) 
        ?? panic("Cannot borrow")
    self.vaultRef = acct.borrow<&FUSD.Vault>(from: /storage/fusdVault) ?? panic("Could not borrow FUSD vault")

  }

  execute {

    let sentVault: @FungibleToken.Vault <- self.vaultRef.withdraw(amount: price)
    let newMyArt <- MyWorldContract.mintMyArt(artData: MyWorldContract.MyArtData(name: name, price: price, uri: uri), paymentVault: <- sentVault)
    self.receiverReference.deposit(token: <-newMyArt)

  }
}
`
