import MyW from "../contracts/MyW.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"

transaction(amount: UFix64, recipient: Address) {
    let vaultRef: &{FungibleToken.Receiver}
    let minterRef: &MyW.Minter

    prepare(acct: AuthAccount) { 

        self.minterRef = acct.borrow<&MyW.Minter>(from: MyW.MyWMinterPath) ??
            panic("Cannot borrow reference to minter")

        self.vaultRef = getAccount(recipient)
            .getCapability(MyW.MyWVaultReceiver)
            .borrow <&{FungibleToken.Receiver}>()
            ?? panic("Account has not been setup for receiving MyW tokens")
        
    }

    execute {
        
        let vault <- self.minterRef.mintTokens(amount: amount)

        self.vaultRef.deposit(from: <- vault)
        // self.vaultRef.deposit(from: <-(vault as! @FungibleToken.Vault) )

    }
}
