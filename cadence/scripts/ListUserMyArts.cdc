import MyWorldContract from "../contracts/MyWorldContract.cdc"

pub fun main(addr: Address): {UInt64: MyWorldContract.MyArtData} {
  let account = getAccount(addr)
  let ref = account.getCapability<&{MyWorldContract.CollectionPublic}>(MyWorldContract.CollectionPublicPath)
              .borrow() ?? panic("Cannot borrow reference")
  let myArts = ref.listMyArts()
  return myArts
}