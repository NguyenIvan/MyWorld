export const LIST_USER_MYARTS = `
  import MyWArt from 0xMyWArtContract

  pub fun main(address: Address):  {UInt64: MyWArt.MyWArtData} {

    let account = getAccount(address)
    
    let dataRef = account
      .getCapability<&{MyWArt.Data}>(MyWArt.MyWArtDataPublicPath).borrow() ??
        panic("Could not borrow a reference to NFT collection")

    return dataRef.getDataCollection()

  }
`