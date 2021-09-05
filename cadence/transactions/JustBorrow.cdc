import MyWorldContract from "../contracts/MyWorldContract.cdc"
import MyMarketplaceContract from "../contracts/MyMarketplaceContract.cdc"


transaction {
    
    prepare(seller: AuthAccount) {
        let collectionRef: &MyWorldContract.Collection = seller.borrow<&MyWorldContract.Collection>
            (from: MyWorldContract.CollectionStoragePath)
                ?? panic("Cannot borrow reference")     
        let saleRef: &{MyMarketplaceContract.SalePublic}= seller.getCapability(MyMarketplaceContract.SaleCollectionPublicPath)
                .borrow<&{MyMarketplaceContract.SalePublic}>() 
                    ?? panic("Cannot borrow reference")        
    }
}