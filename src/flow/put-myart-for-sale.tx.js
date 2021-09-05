export const PUT_MYART_FOR_SALE = `
import MyWorldContract from 0xMyWorld
import MyMarketplaceContract from 0xMyMarketplace

transaction(myWorldAdmin: Address, myArtId: UInt64, wantPrice: UFix64) {

    // let seller: AuthAccount
    let saleRef: &{MyMarketplaceContract.SalePublic}
    let collectionRef: &MyWorldContract.Collection

    prepare(seller: AuthAccount) {
        
        let adminAccount = getAccount(myWorldAdmin)
        /* Sale Collection */
        self.saleRef = adminAccount
            .getCapability(MyMarketplaceContract.SaleCollectionPublicPath)
            .borrow<&{MyMarketplaceContract.SalePublic}>() 
                ?? panic("Cannot borrow reference")

        /* Private Collection */
        self.collectionRef = seller
            .borrow<&MyWorldContract.Collection>
            (from: MyWorldContract.CollectionStoragePath)
                ?? panic("Cannot borrow reference")     

    }

    execute {

        let myArt <- self.collectionRef.withdraw(withdrawID: myArtId)
        let price = myArt.data.price /* Need to change the price */
        self.saleRef.putForSale(token: <-myArt, wantPrice: wantPrice)

    }
    
}
`