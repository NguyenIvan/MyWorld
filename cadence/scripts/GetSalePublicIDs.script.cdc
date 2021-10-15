import MyWArt from "../contracts/MyWArt.cdc"
import MyWMarket from "../contracts/MyWMarket.cdc"
// import MyWArt from 0x179b6b1cb6755e31
// import MyWMarket from 0x179b6b1cb6755e31

// Returns: UInt64
// Number of moments minted from MyWArt contract

pub fun main(address: Address): [UInt64] {

    let account = getAccount(address)
    log("*****************")
    let salePublic = account.getCapability(MyWMarket.MyWSalePublicPath)
        .borrow<&{MyWMarket.SalePublic}>() 
        ?? panic ("Cannot borrow from sale public path")

    return salePublic.getIDs()
    
}