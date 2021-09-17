import {
  getAccountAddress,
  mintFlow,
  deployContractByName,
  sendTransaction,
  executeScript
} from "flow-js-testing"

export const TEST_MYART = {
  name: "Panda Dappy",
  price: "7.00000000",
  uri: "https://ipfs.io/ipfs/bafybeih2xfiepfxicjy2qkfxktzmpbe6nx4mqfkalvbtajiwmdyb32kwk4"
}

export const deployMyWorldContract = async(accountAddress) => {
  const account = accountAddress ? accountAddress : await getAccountAddress("MyWorldAdmin")
  await mintFlow(account, "10.0")
  const addressMap = {FungibleToken: "0xee82856bf20e2aa6"}
  await deployContractByName({ to:account, name: "MyWorldContract", addressMap})
}

export const createMyArtCollection = async (recipient) => {
  const name = "CreateMyArtCollection"
  const signers = [recipient]
  await sendTransaction({ name, signers })
}

export const mintMyArt = async (recipient, myArtData) => {
  const name = "MintMyArt"
  const signers = [recipient]
  const args = [myArtData.name, myArtData.price, myArtData.uri]
  await sendTransaction({ name, args, signers})
}

export const listUserMyArts = async (recipient) => {
  const name = "ListUserMyArts"
  const args = [recipient]
  const myArts = await executeScript({ name, args })
  return myArts
}