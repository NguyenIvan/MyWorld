import {
  getAccountAddress,
  mintFlow,
  deployContractByName,
  getContractAddress,
  executeScript,
  sendTransaction
} from "flow-js-testing"

import { fundAccountWithFUSD } from "./FUSD";

import {
  deployMyWorldContract,
  createMyArtCollection,
  mintMyArt 
} from "./MyWorldContract"

export const deployMyMarketContract = async(accountAddress) => {
  const account = accountAddress ? accountAddress : await getAccountAddress("MyWorldAdmin")
  await mintFlow(account, "10.0")
  let addressMap = {FungibleToken: "0xee82856bf20e2aa6"}
  const myWorld = await getContractAddress("MyWorldContract")
  addressMap.MyWorldContract = myWorld
  await deployContractByName({ to:account, name: "MyMarketplaceContract", addressMap})
}

export const putOneForSale = async({name, price}) => {
  const MyWorldAdmin = await getAccountAddress("MyWorldAdmin")
  const Seller = await getAccountAddress("Seller")
  await mintFlow(MyWorldAdmin, "10.0")
  await mintFlow(Seller, "10.0")
  await fundAccountWithFUSD(Seller, "100.00")
  await deployMyWorldContract(Seller)
  await createMyArtCollection(Seller)
  await mintMyArt(Seller, {name, price})
  await deployMyMarketContract(MyWorldAdmin)
  await sendTransaction({name: "PutMyArtForSale", signers: [MyWorldAdmin, Seller], args: [name, price]})
  const res = await executeScript({name: "ListSaleCollection",args: [MyWorldAdmin]})
  return res
}

