import MyMarketplaceContract from "../contracts/MyMarketplaceContract.cdc"

pub fun main(address: Address): Int {
  let account = getAccount(address)
  let saleRef = account.getCapability<
    &{MyMarketplaceContract.SalePublic}>
    (MyMarketplaceContract.SaleCollectionPublicPath)
    .borrow() ?? panic("Cannot borrow reference")
  return saleRef.getIDs().length
}


// pub fun listMyArts(): {UInt64: MyArtData} {
//       var myArts: {UInt64: MyArtData} = {}
//       for key in self.ownedMyArts.keys {
//         let el = &self.ownedMyArts[key] as &MyArt
//         myArts.insert(key: el.id, el.data)
//       }
//       return myArts
//     }