export const CREATE_MYW_VAULT = `
  import FungibleToken from 0xFungibleTokenContract
  import MyW from 0xMyWContract

  transaction {
    prepare(signer: AuthAccount) {
      if(signer.borrow<&MyW.Vault>(from: MyW.MyWVaultStorage) != nil) {
        return
      }
    
      signer.save(<-MyW.createEmptyVault(), to: MyW.MyWVaultStorage)

      signer.link<&{FungibleToken.Receiver}>(
        MyW.MyWVaultReceiver,
        target: MyW.MyWVaultStorage
      )

      signer.link<&{FungibleToken.Balance}>(
        MyW.MyWVaultBalance,
        target: MyW.MyWVaultStorage
      )
    }
  }
`