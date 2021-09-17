import {
  arg,
  getAccountAddress,
  mintFlow,
  deployContractByName,
  getContractAddress,
  executeScript,
  sendTransaction
} from "flow-js-testing"

import { fundAccountWithFUSD, fundAccountWithFUSDFast } from "./FUSD";

import {
  deployMyWorldContract,
  createMyArtCollection,
  mintMyArt, 
  listUserMyArts
} from "./MyWorldContract"

export const deployMyMarketContract = async(accountAddress) => {
  const account = accountAddress ? accountAddress : await getAccountAddress("MyWorldAdmin")
  await mintFlow(account, "10.0")
  let addressMap = {FungibleToken: "0xee82856bf20e2aa6"}
  const myWorld = await getContractAddress("MyWorldContract")
  addressMap.MyWorldContract = myWorld  
  await deployContractByName(
    { to:account, name: "MyMarketplaceContract", addressMap})
}

export const putOneForSale = async({name, price, uri}) => {
  const MyWorldAdmin = await getAccountAddress("MyWorldAdmin")
  const Seller = await getAccountAddress("Seller")
  await deployMyWorldContract(MyWorldAdmin)
  await deployMyMarketContract(MyWorldAdmin)
  await mintFlow(Seller, "10.0")
  await mintFlow(MyWorldAdmin, "10.0")
  await fundAccountWithFUSD(Seller, "100.00")
  await fundAccountWithFUSDFast(MyWorldAdmin, "100.00")
  await createMyArtCollection(Seller)
  await mintMyArt(Seller, {name, price, uri})
  const myArts = await listUserMyArts(Seller)
  const myArtId = parseInt(Object.keys(myArts)[0]) 
  const wantPrice = myArts[myArtId].price
  await sendTransaction({name: "PutMyArtForSale", signers: [Seller], args: [MyWorldAdmin, myArtId, wantPrice]})
  const res = await executeScript({name: "ListSaleCollection",args: [MyWorldAdmin]})
  return res
}

export const justBorrow = async() => {
  const Seller = await getAccountAddress("Seller")
  await deployMyWorldContract(Seller)
  await deployMyMarketContract(Seller)
  await createMyArtCollection(Seller)

  await sendTransaction({name: "JustBorrow", signers: [Seller]})
}


