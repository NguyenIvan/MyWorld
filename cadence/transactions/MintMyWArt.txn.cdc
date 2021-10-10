import MyWArt from "../contracts/MyWArt.cdc" 
import MyW from "../contracts/MyW.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"

// This transaction is what an admin would use to mint a single NFT
// and deposit it in a user's collection

// AuthAccount must have enough MyW token balance to pay for minting fee

transaction() { 
    // local variable for the admin reference
    let minterRef: &{MyWArt.MinterProxyPublic}
    let paymentVault: @MyW.Vault
    let collectionRef: &{NonFungibleToken.CollectionPublic}

    prepare(acct: AuthAccount) {
        // borrow a reference to the Admin resource in storage
        self.minterRef = acct
            .getCapability(MyWArt.MinterProxyPublicPath)
            .borrow<&{MyWArt.MinterProxyPublic}>() ??
                panic("Cannot borrow reference to minter")

        self.collectionRef = acct
            .getCapability(MyWArt.MyWArtCollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>() ??
                panic("Cannot borrow reference to collection public for receiving nft")
            
        let myWRef = acct.borrow<&MyW.Vault>(from: MyW.MyWVaultStorage) ??
            panic("Cannot borrow reference to MyW vault")
        self.paymentVault <- myWRef.withdraw(amount: MyWArt.DefaultMintFee) as! @MyW.Vault
    }

    execute {

        // Mint a new NFT
        let data = MyWArt.MyWArtData(
            name: "First MyWArt",
            price: 100.00,
            uri: "http://mywart.com/first.jpg",
            description: "From my world!"
        )

        let nft <- self.minterRef.mintMyWArt(data: data, fee: <-self.paymentVault)
          
        self.collectionRef.deposit(token: <-nft)

    }
}
