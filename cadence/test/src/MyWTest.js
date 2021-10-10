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

export const createMyWMinter = async(addressMap) => {
    const name = "CreateMyWMinter.txn"
    const args = []
    const signers = [await getAccountAddress("MyWorldAdmin")]
    await sendTransaction({name, signers, args, addressMap})
}

export const initMyWArtCollection = async(addressMap) => {
  const name = "InitMyWArtCollection.txn"
  const args = []
  const signers = [await getAccountAddress("MyWorldAdmin")]
    await sendTransaction({name, signers, args, addressMap})
}

export const setupMyWVault = async(addressMap) => {
  const name = "SetupMyWVault.txn"
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

export const sendMyWToken = async(amount, addressMap) => {
  const name = "SendMyWToken.txn"
  const recipient = await getAccountAddress("MyWorldAdmin")
  const args = [amount, recipient]
  const signers = [recipient]
  await sendTransaction({name, signers, args, addressMap})
}

export const getMyWBalance = async(addressMap) => {
  const name = "GetMyWBalance.script"
  const address = await getAccountAddress("MyWorldAdmin")
  const args = [address]
  const balance = await executeScript({name, args, addressMap})
  return balance
}

export const mintMyWArt = async(addressMap) => {
  const name = "MintMyWArt.txn"
  const recipient = await getAccountAddress("MyWorldAdmin")
  const args = []
  const signers = [recipient]
  await sendTransaction({name, signers, args, addressMap})
}