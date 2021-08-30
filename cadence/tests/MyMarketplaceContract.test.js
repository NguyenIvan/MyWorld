import path from "path"

import {
  emulator,
  init,
  executeScript,
  mintFlow,
  getAccountAddress
} from "flow-js-testing"

import {
  deployMyWorldContract,
  TEST_MYART
} from "./src/MyWorldContract";

import {
  deployMyMarketContract,
  putOneForSale
} from "./src/MyMarketplaceContract";

jest.setTimeout(50000);

describe("MyMarketplace", () => {
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../");
    const port = 8080;
    init(basePath, port); /* init from flow-js-testing */
    return emulator.start(port, false);
  });

  afterEach(async () => {
    return emulator.stop();
  });

  it("deploys Marketplace contract", async () => {
    const MyWorldAdmin = await getAccountAddress("MyWorldAdmin")
    await deployMyWorldContract(MyWorldAdmin)
    await deployMyMarketContract(MyWorldAdmin)
    expect(true).toBe(true)
  });
  
  it("should has empty sale collection", async() => {
    const MyWorldAdmin = await getAccountAddress("MyWorldAdmin")
    await deployMyWorldContract(MyWorldAdmin)
    await deployMyMarketContract(MyWorldAdmin)
    const collectionSize = await executeScript({ name: "GetCollectionSize", args: [MyWorldAdmin] })
    expect(collectionSize).toBe(0)
  })

  it("should list  1 NFT MyArt from a seller for sale in the the admin's sale collection", async() => {
    const forSale = await putOneForSale(TEST_MYART)
    expect(forSale.length).toEqual(1)
  })

})


 