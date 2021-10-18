import {

    getAccountAddress,
    mintFlow,
    deployContractByName,
    executeScript,
    sendTransaction,
    getServiceAddress,
    getContractAddress,

  } from "flow-js-testing"

export const deployContract = async(accountAddress, contractName, addressMap) => {

    const account = accountAddress ? accountAddress : (async () => {
        const addr = await getAccountAddress("MyWorldAdmin")
        await mintFlow(account, "10.0")
        return addr
    })()    

    await deployContractByName({ to:account, name: contractName, addressMap})

}

export const deployAll = async(contracts, accountAddress) => {
    contracts = contracts ?? [
        "NonFungibleToken",
        "MyW",
        "MyWArt"
      ]
    const ftAddress = await getContractAddress("FungibleToken")
    const addressMap = ftAddress ? {"FungibleToken": ftAddress} : {}
    if (! ftAddress) contracts.push("FungibleToken")
      
    accountAddress = accountAddress ?? await getAccountAddress("MyWorldAdmin")

    await mintFlow(accountAddress, "10.0")
    for (const contractName of contracts) {
      await deployContract(accountAddress, contractName, addressMap)
      addressMap[contractName] = accountAddress
    }
    return addressMap
}

export const getMyWArtTotalSupply = async() => {
    const name = "GetMyWArtTotalSupply.script"
    const args = []
    const totalSupply = await executeScript({name, args})
    return totalSupply
}

export const getSalePublicIDs = async(address) => {
    const name = "GetSalePublicIDs.script"
    const args = [address]
    const salePublicIDs = await executeScript({name, args})
    return salePublicIDs
}

export const createMyWMinter = async(addressMap) => {
    const name = "CreateMyWMinter.txn"
    const args = []
    const signers = [await getAccountAddress("MyWorldAdmin")]
    await sendTransaction({name, signers, args, addressMap})
}

export const logIt = async(addressMap) => {
  const name = "LogIt.txn"
  const recipient = await getAccountAddress("MyWorldAdmin")
  const amount = 1000.00
  const args = [amount, recipient]
  const signers = [recipient]
  await sendTransaction({name, signers, args, addressMap})
}

export const getMyWBalance = async(addressMap, addr) => {
  const name = "GetMyWBalance.script"
  const args = [addr]
  const balance = await executeScript({name, args, addressMap})
  return balance
}

export const setupMyWVault = async(addressMap, addr) => {
  const name = "SetupMyWVault.txn"
  const args = []
  const signers = [addr]
  await sendTransaction({name, signers, args, addressMap})
}

export const sendMyWToken = async(amount, addressMap, recipient) => {
  const name = "SendMyWToken.txn"
  const minter = await getAccountAddress("MyWorldAdmin")
  const args = [amount, recipient]
  const signers = [minter]
  await sendTransaction({name, signers, args, addressMap})
}

export const initMyWArtCollection = async(addressMap) => {
  const name = "InitMyWArtCollection.txn"
  const args = []
  const signers = [await getAccountAddress("Seller")]
    await sendTransaction({name, signers, args, addressMap})
}

export const mintMyWArt = async(addressMap) => {
  const name = "MintMyWArt.txn"
  const recipient = await getAccountAddress("Seller")
  const minter = await getAccountAddress("MyWorldAdmin")
  const args = [minter]
  const signers = [recipient]
  await sendTransaction({name, signers, args, addressMap})
}

export const putMyWArtForSale = async(addressMap, artId, wantPrice) => {
  const name = "PutMyWArtForSale.txn"
  const seller = await getAccountAddress("Seller")
  const args = [artId, wantPrice]
  const signers = [seller]
  await sendTransaction({name, signers, args, addressMap})
}

// purchase art (artId) from seller
export const purchaseMyWArt = async(addressMap, artId, buyer, seller) => {
  const name = "PurchaseMyWArt.txn"
  const args = [artId, seller]
  const signers = [buyer]
  await sendTransaction({name, signers, args, addressMap})
}
