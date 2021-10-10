import MyW from "../contracts/MyW.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"

transaction(){
    
    // let account: AuthAccount
    prepare(acct: AuthAccount) {
        // check if receiver capability was setup yet to /public/MyWVaultReceiver?
        // acct = acct
        if ! acct.getCapability(MyW.MyWVaultReceiver)
            .check<&{FungibleToken.Receiver}>() {

                // if not, check if a MyW token vault was saved to /storage/MyWVaultStorage
                if acct.borrow<&MyW.Vault>(from: MyW.MyWVaultStorage) == nil {
                    // create an empty vault and save to that path

                    let vault <- MyW.createEmptyVault()
                    acct.save<@MyW.Vault>(<- vault, to: MyW.MyWVaultStorage)
                }   

                // expose balance interface 
                if ! acct.getCapability(MyW.MyWVaultBalance)
                    .check<&{FungibleToken.Balance}>() {
                        acct.link<&{FungibleToken.Balance}>(MyW.MyWVaultBalance, target: MyW.MyWVaultStorage)
                    }

                // then expose receiver capability
                acct.link<&{FungibleToken.Receiver}>(MyW.MyWVaultReceiver, target: MyW.MyWVaultStorage)

        }
        
    }
    execute {
    }
}