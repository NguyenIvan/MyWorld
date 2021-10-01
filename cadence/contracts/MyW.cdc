import FungibleToken from "./FungibleToken.cdc"
// import FungibleToken from 0xf8d6e0586b0a20c7

pub contract MyW: FungibleToken {

    pub var totalSupply: UFix64

    pub event TokensInitialized(initialSupply: UFix64)

    pub event TokensWithdrawn(amount: UFix64, from: Address?)

    pub event TokensDeposited(amount: UFix64, to: Address?)

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {

        pub var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }

        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <-create Vault(balance: amount)
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @MyW.Vault
            self.balance = self.balance + vault.balance
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            vault.balance = 0.0
            destroy vault
        }

        destroy() {
            MyW.totalSupply = MyW.totalSupply - self.balance
        }
    }

    pub fun createEmptyVault(): @Vault {
        post {
            result.balance == 0.0: "The newly created Vault must have zero balance"
        }
        return <- create Vault(balance: 0.0)
    }

    pub init() {
        self.totalSupply = 1000000000.00
    }

}
 