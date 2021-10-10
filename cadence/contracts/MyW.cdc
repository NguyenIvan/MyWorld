import FungibleToken from "./FungibleToken.cdc"
// import FungibleToken from 0xf8d6e0586b0a20c7

pub contract MyW: FungibleToken {

    pub var totalSupply: UFix64

    pub let MaxSupply: UFix64
    pub let MyWAdminPath: StoragePath

    pub let MyWMinterPath: StoragePath

    pub let MyWVaultStorage: StoragePath
    
    pub let MyWVaultReceiver: PublicPath
    pub let MyWVaultBalance: PublicPath

    pub event MinterCreated()

    pub event TokensMinted(amount: UFix64, totalSupply: UFix64)

    pub event TokensInitialized(initialSupply: UFix64)

    pub event TokensWithdrawn(amount: UFix64, from: Address?)

    pub event TokensDeposited(amount: UFix64, to: Address?)

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {

        // TODO: cannot change balance of a vault. Should change to getter
        pub var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }

        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            // TODO: check if balance would be negative (invalid)
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <-create Vault(balance: amount)
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            // TODO: check if balance of the coming vault is positive
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

        // Minter
    //
    // Resource object that can mint new tokens.
    // The admin stores this and passes it to the minter account as a capability wrapper resource.
    //
    pub resource Minter {

        // mintTokens
        //
        // Function that mints new tokens, adds them to the total supply,
        // and returns them to the calling context.
        //
        pub fun mintTokens(amount: UFix64): @Vault {
            pre {
                amount > 0.0: "Amount minted must be greater than zero"
                amount + MyW.totalSupply <= MyW.MaxSupply
            }
            MyW.totalSupply = MyW.totalSupply + amount
            emit TokensMinted(amount: amount, totalSupply: MyW.totalSupply)
            return <-create Vault(balance: amount)
        }
    }

        pub resource Administrator {

        // createNewMinter
        //
        // Function that creates a Minter resource.
        // This should be stored at a unique path in storage then a capability to it wrapped
        // in a MinterProxy to be stored in a minter account's storage.
        // This is done by the minter account running:
        // transactions/FUSD/minter/setup_minter_account.cdc
        // then the admin account running:
        // transactions/flowArcaddeToken/admin/deposit_minter_capability.cdc
        //
        pub fun createNewMinter(): @Minter {
            emit MinterCreated()
            return <- create Minter()
        }

    }

    pub init() {
        self.totalSupply = 0.0
        // TODO: check mint and max supply
        self.MaxSupply = 10_000_000_000.00

        self.MyWAdminPath = /storage/MyWAdmin

        self.MyWMinterPath = /storage/MyWMinter

        self.totalSupply = 0.0

        let admin <- create Administrator()
        self.account.save(<-admin, to: self.MyWAdminPath)

        let minter <- create Minter()
        self.account.save(<-minter, to: self.MyWMinterPath)

        self.MyWVaultStorage = /storage/MyWVault
        self.MyWVaultReceiver = /public/MyWVaultReceiver
        self.MyWVaultBalance = /public/MyWVaultBalance

        // Emit an event that shows that the contract was initialized
        emit TokensInitialized(initialSupply: 0.0)


     }

}
 