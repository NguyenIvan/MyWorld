export const LIST_SALE_COLLECTION = `
    import MyMarketplaceContract from 0xMyWorld
    import MyWorldContract from 0xMyWorld
    
    pub fun main(address: Address): {UInt64: MyWorldContract.MyArtData} {
    let account = getAccount(address)
    let saleRef = account.getCapability<
        &{MyMarketplaceContract.SalePublic}>
        (MyMarketplaceContract.SaleCollectionPublicPath)
        .borrow() ?? panic("Cannot borrow reference")
    return saleRef.getCollection()
    }
`