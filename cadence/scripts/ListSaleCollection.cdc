import MyMarketplaceContract from "../contracts/MyMarketplaceContract.cdc"
import MyWorldContract from "../contracts/MyWorldContract.cdc"

pub fun main(address: Address): [UInt64] {
  let account = getAccount(address)
  let saleRef = account.getCapability<&{MyMarketplaceContract.SalePublic}>
    (MyMarketplaceContract.SaleCollectionPublicPath)
      .borrow() ?? panic("Cannot borrow reference")
  
  return saleRef.getIDs()
}

