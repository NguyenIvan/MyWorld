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
  createMyArtCollection,
  mintMyArt,
  listUserMyArts
} from "./src/MyWorldContract";
import { fundAccountWithFUSD } from "./src/FUSD";

const TEST_MYART = {
  name: "Panda Dappy",
  price: "7.00000000"
}

jest.setTimeout(50000);

describe("MyWorld", () => {
  beforeEach(async () => {
    const basePath = path.resolve(__dirname, "../");
    const port = 8080;
    init(basePath, port); /* init from flow-js-testing */
    return emulator.start(port, false);
  });

  afterEach(async () => {
    return emulator.stop();
  });

  it("deploys MyWorld contract", async () => {
    await deployMyWorldContract()
  });
  
  it("should has 0 MyArts", async () => {
    await deployMyWorldContract()
    const res = await executeScript({ name: "GetTotalMyArts" })
    expect(res).toEqual(0)
  });

  it("Should mint FUSD", async () => {
    const recipient = await getAccountAddress("MyArtRecipient")
    const balance = await fundAccountWithFUSD(recipient, "100.00")
    expect(balance).toBe("100.00000000")
  })

  
  it("Should mint a MyArt", async () => {
    await deployMyWorldContract()
    const recipient = await getAccountAddress("MyArtRecipient")
    await mintFlow(recipient, "10.0")
    await fundAccountWithFUSD(recipient, "100.00")
    await createMyArtCollection(recipient)
    await mintMyArt(recipient, TEST_MYART)
    const userMyArts = await listUserMyArts(recipient)
    expect(userMyArts['1']).toMatchObject(TEST_MYART)
  })
})