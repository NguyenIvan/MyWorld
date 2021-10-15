import path from "path"
import {
  getAccountAddress,
  mintFlow,
  emulator,
  init,
  getContractAddress
} from "flow-js-testing"


import * as myWTest from "./src/MyWTest"

jest.setTimeout(50000)

describe("MyWorld", () => {

    //#region test fixture setup
    beforeEach(async () => {
      const basePath = path.resolve(__dirname, "../")
      const port = 8080
      init(basePath, port) /* init from flow-js-testing */
      return emulator.start(port, false)
    })
  
    afterEach(async () => {
      return emulator.stop()
    })
    //#endregion
  
  it("deploys MyWorld contract", async () => {
    const contracts = [
      "NonFungibleToken",
      "MyW",
      "MyWArt",
      "MyWMarket"
    ]
    const accountAddress = await getAccountAddress("MyWorldAdmin")
    await myWTest.deployAll(contracts, accountAddress)
    for (const contractName of contracts) {
      expect(await getContractAddress(contractName)).toEqual(accountAddress) 
    }
  })

  it("mints one MyWArt NFT", async() => {
    const contracts = [
      "NonFungibleToken",
      "MyW",
      "MyWArt",
      "MyWMarket"
    ]
    // emulator.setLogging(true)
    const seller = await getAccountAddress("Seller")
    const admin = await getAccountAddress("MyWorldAdmin")
    
    const addressMap = await myWTest.deployAll(contracts, admin)

    const totalSupply = await myWTest.getMyWArtTotalSupply()
    expect (totalSupply).toEqual(0)

    await myWTest.createMyWMinter(addressMap)
    
    await myWTest.setupMyWVault(addressMap, seller)
    await myWTest.setupMyWVault(addressMap, admin)

    await myWTest.initMyWArtCollection(addressMap)
    
    const amount = 1000.00
    await myWTest.sendMyWToken(amount, addressMap)

    const balance = await myWTest.getMyWBalance(addressMap)
    expect(Number(balance)).toEqual(amount)

    await myWTest.mintMyWArt(addressMap)

    const newID = await myWTest.getMyWArtTotalSupply()
    expect (newID).toEqual(1)

  })

  it("put one nft for sale", async () => {
    const contracts = [
      "NonFungibleToken",
      "MyW",
      "MyWArt",
      "MyWMarket"
    ]
 
    const seller = await getAccountAddress("Seller")
    const admin = await getAccountAddress("MyWorldAdmin")
    const addressMap = await myWTest.deployAll(contracts, admin)

    const totalSupply = await myWTest.getMyWArtTotalSupply()
    expect (totalSupply).toEqual(0)

    await myWTest.createMyWMinter(addressMap)
    
    // Setup MyWVault should be called before initMyWArtCollection
    await myWTest.setupMyWVault(addressMap, seller)
    await myWTest.setupMyWVault(addressMap, admin)

    await myWTest.initMyWArtCollection(addressMap)
    
    const amount = 1000.00
    await myWTest.sendMyWToken(amount, addressMap)

    const balance = await myWTest.getMyWBalance(addressMap)
    expect(Number(balance)).toEqual(amount)

    await myWTest.mintMyWArt(addressMap)

    const newID = await myWTest.getMyWArtTotalSupply()
    expect (newID).toEqual(1)

    const wantPrice = 2000.00
    await myWTest.putMyWArtForSale(addressMap, newID, wantPrice)
    const saleID = await myWTest.getSalePublicIDs(seller, admin)
    
    expect (saleID[0]).toEqual(newID) 

  })

})
  