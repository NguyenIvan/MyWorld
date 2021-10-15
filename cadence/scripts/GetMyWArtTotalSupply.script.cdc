import MyWArt from "../contracts/MyWArt.cdc"

// Returns: UInt64
// Number of moments minted from MyWArt contract

pub fun main(): UInt64 {

    return MyWArt.totalSupply
    
}