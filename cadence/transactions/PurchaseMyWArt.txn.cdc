import MyWArt from "../contracts/MyWArt.cdc" 
import MyW from "../contracts/MyW.cdc"
import MyWMarket from "../contracts/MyWMarket.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"

transaction(artId: UInt64, sellerAddress: Address) {

    let collectionRef: &{NonFungibleToken.CollectionPublic}
    let saleRef: &{MyWMarket.SalePublic}
    let vaultRef: &MyW.Vault
    let want_price: UFix64

    prepare(acct: AuthAccount) {

        // Get collection receiver capability
        self.collectionRef = acct
            .getCapability(MyWArt.MyWArtCollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic(" Could not borrow reference to MyWArt receiver")
        
        let sellerAccount = getAccount(sellerAddress) 
        
        // Get Sale Collection  capability
        self.saleRef = sellerAccount
            .getCapability(MyWMarket.MyWSalePublicPath)
            .borrow<&{MyWMarket.SalePublic}>()
            ?? panic(" Could not borrow reference to MyWArt sale collection")

        
        // Get vault
        self.vaultRef = acct.borrow<&MyW.Vault>(from: MyW.MyWVaultStorage)
            ?? panic(" Could not borrow reference to MyW main vault")

        // Check balance
        self.want_price = self.saleRef.getPrice(tokenID: artId)!
        
        log("*************************")
        log(self.vaultRef.balance)

        assert(self.vaultRef.balance >= self.want_price, message: "Not enought MyW balance to purcase the art")

    }

    execute {

        let vault <- self.vaultRef.withdraw(amount: self.want_price)

        let nft <- self.saleRef.purchase(tokenID: artId, buyTokens: <- vault)

        self.collectionRef.deposit(token: <- nft)

    }

}
