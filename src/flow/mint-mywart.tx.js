export const MINT_MYWART = `
import MyWArt from 0xMyWArtContract
import MyW from 0xMyWContract
import NonFungibleToken from 0xNonFungibleTokenContract

// This transaction is what an admin would use to mint a single NFT
// and deposit it in a user's collection

// AuthAccount must have enough MyW token balance to pay for minting fee

transaction(name: String, price: UFix64, uri: String, description: String, minter: Address) { 
    // local variable for the admin reference
    let minterRef: &{MyWArt.MinterProxyPublic}
    let collectionRef: &{NonFungibleToken.CollectionPublic}
    let myWRef: &MyW.Vault

    prepare(acct: AuthAccount) {

        let admin = getAccount(minter)

        self.minterRef = admin
            .getCapability(MyWArt.MinterProxyPublicPath)
            .borrow<&{MyWArt.MinterProxyPublic}>() ??
                panic("Could not borrow reference to minter")

        self.collectionRef = acct
            .getCapability(MyWArt.MyWArtCollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>() ??
                panic("Could not borrow reference to collection public for receiving nft")
            
        self.myWRef = acct.borrow<&MyW.Vault>(from: MyW.MyWVaultStorage) ??
            panic("Could not borrow reference to MyW vault")

        assert(self.myWRef.balance >= MyWArt.DefaultMintFee, message: "Could not mint NFT: MyW token balance is low")    

    }

    execute {

        let paymentVault <- self.myWRef.withdraw(amount: MyWArt.DefaultMintFee) as! @MyW.Vault

        // Mint a new NFT
        let data = MyWArt.MyWArtData(
            name: name,
            price: price,
            uri: uri,
            description: description
        )

        let nft <- self.minterRef.mintMyWArt(data: data, fee: <- paymentVault)
          
        self.collectionRef.deposit(token: <-nft)

    }
}
`