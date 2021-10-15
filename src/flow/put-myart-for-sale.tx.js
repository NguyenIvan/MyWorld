export const PUT_MYART_FOR_SALE = `
import MyWArt from 0xMyWArtContract
import NonFungibleToken from 0xNonFungibleTokenContract
import MyWMarket from 0xMyWMarketContract

transaction(artId: UInt64, wantPrice: UFix64) {

    let collectionRef: &MyWArt.Collection
    let saleRef: &MyWMarket.SaleCollection

    prepare(acct: AuthAccount) {

        self.collectionRef = acct.borrow<&MyWArt.Collection>(
            from: MyWArt.MyWArtCollectionStoragePath
        ) 
            ?? panic(" Could not borrow reference to MyWArt private collection")
        
        self.saleRef = acct.borrow<&MyWMarket.SaleCollection>(
            from: MyWMarket.MyWSaleCollectionPath
        )
            ?? panic(" Could not borrow reference to MyWArt sale collection")

    }

    execute {

        let nft <- self.collectionRef
            .withdraw(withdrawID: artId) as! @MyWArt.NFT
        
        self.saleRef.listForSale(
            token: <- nft,
            price: wantPrice
        )

    }

}
`