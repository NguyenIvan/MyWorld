import {
  getAccountAddress,
  mintFlow,
  deployContractByName,
  sendTransaction,
  executeScript
} from "flow-js-testing"

export const deployMyWorldContract = async() => {
  const MyWorldAdmin = await getAccountAddress("MyWorldAdmin")
  await mintFlow(MyWorldAdmin, "10.0")
  const addressMap = {FungibleToken: "0xee82856bf20e2aa6"}
  await deployContractByName({ to:MyWorldAdmin, name: "MyWorldContract", addressMap})
}

export const createMyArtCollection = async (recipient) => {
  const name = "CreateMyArtCollection"
  const signers = [recipient]
  await sendTransaction({ name, signers })
}

export const mintMyArt = async (recipient, myArtData) => {
  const name = "MintMyArt"
  const signers = [recipient]
  const args = [myArtData.name, myArtData.price]
  await sendTransaction({ name, args, signers})
}

export const listUserMyArts = async (recipient) => {
  const name = "ListUserMyArts"
  const args = [recipient]
  const myArts = await executeScript({ name, args })
  return myArts
}