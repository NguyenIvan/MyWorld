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
      "MyWArt"
    ]
    // emulator.setLogging(true)

    const accountAddress = await getAccountAddress("MyWorldAdmin")
    const addressMap = await myWTest.deployAll(contracts, accountAddress)

    const totalSupply = await myWTest.getMyWArtTotalSupply()
    expect (totalSupply).toEqual(0)

    await myWTest.createMyWMinter(addressMap)
    
    await myWTest.initMyWArtCollection(addressMap)
    
    await myWTest.setupMyWVault(addressMap)

    const amount = 1000.00
    await myWTest.sendMyWToken(amount, addressMap)

    const balance = await myWTest.getMyWBalance(addressMap)
    expect(Number(balance)).toEqual(amount)

    await myWTest.mintMyWArt(addressMap)

    const newID = await myWTest.getMyWArtTotalSupply()
    expect (newID).toEqual(1)

  })

})
  