export const GET_MYW_BALANCE = `
  import FungibleToken from 0xFungibleTokenContract
  import MyW from 0xMyWContract

  pub fun main(address: Address): UFix64? {
    let account = getAccount(address)
    if let vaultRef = account.getCapability(MyW.MyWVaultBalance).borrow<&{FungibleToken.Balance}>() {
      return vaultRef.balance
    } 
    return nil
  }
`