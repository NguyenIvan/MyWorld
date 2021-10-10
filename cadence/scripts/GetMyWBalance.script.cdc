import MyW from "../contracts/MyW.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"

// Returns: UInt64
// MyW main vault balance of the given address

pub fun main(address: Address): UFix64 {

    let account = getAccount(address)

    let balanceRef = account.getCapability(MyW.MyWVaultBalance)
        .borrow<&{FungibleToken.Balance}>()!

    log("********************************")
    log(balanceRef)
    log(balanceRef.balance)
    log("********************************")
    return balanceRef.balance
   
}