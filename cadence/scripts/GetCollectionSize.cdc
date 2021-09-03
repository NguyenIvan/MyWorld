import MyMarketplaceContract from "../contracts/MyMarketplaceContract.cdc"

pub fun main(address: Address): Int {
  let account = getAccount(address)
  let saleRef = account.getCapability<
    &{MyMarketplaceContract.SalePublic}>
    (MyMarketplaceContract.SaleCollectionPublicPath)
    .borrow() ?? panic("Cannot borrow reference")
  return saleRef.getIDs().length
}