import MyW from "../contracts/MyW.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"

transaction(amount: UFix64, recipient: Address) {
  
    let publicAccount: PublicAccount
    let authAccount: AuthAccount
    prepare(acct: AuthAccount) { 
        self.publicAccount = getAccount(acct.address)
        self.authAccount = acct
    }

    execute {
        log("********************************")
        log(self.publicAccount.address)
        log(self.publicAccount.getCapability(MyW.MyWVaultReceiver).check<&{FungibleToken.Receiver}>())
        log(self.publicAccount.getCapability(MyW.MyWVaultBalance).check<&{FungibleToken.Balance}>() )
    }
}
