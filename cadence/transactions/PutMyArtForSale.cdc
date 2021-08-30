import MyMarketplaceContract from "../contracts/MyMarketplaceContract.cdc"
import MyWorldContract from "../contracts/MyWorldContract.cdc"

transaction(name: String, price: UFix64) {

    let admin: AuthAccount
    let saleRef: &MyMarketplaceContract.SaleCollection
    let collectionRef: &MyWorldContract.Collection

    prepare(admin: AuthAccount, seller: AuthAccount) {
        self.admin = admin 
        /* Sale Collection */
        self.saleRef = admin.borrow<&MyMarketplaceContract.SaleCollection>
            (from: MyMarketplaceContract.SaleCollectionStoragePath)
                ?? panic("Cannot borrow reference")
       
        /* Private Collection */
        self.collectionRef = seller.borrow<&MyWorldContract.Collection>
            (from: MyWorldContract.CollectionStoragePath)
                ?? panic("Cannot borrow reference")     
    }

    execute {
        let myArt <- self.collectionRef.withdraw(withdrawID: 1)
        let price = myArt.data.price
        self.saleRef.listForSale(token: <-myArt, wantPrice: price)
    }
    
}
