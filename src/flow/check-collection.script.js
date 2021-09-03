export const CHECK_COLLECTION = `
import MyWorldContract from 0xMyWorld

pub fun main(addr: Address): Bool {
  let ref = getAccount(addr).getCapability<&{MyWorldContract.CollectionPublic}>(MyWorldContract.CollectionPublicPath).check()
  return ref
}
`
// getAccount fun can only run check(), but not borrow()

// export const CHECK_COLLECTION = `
//   import DappyContract from 0xDappy
  
//   pub fun main(addr: Address): Bool {
//     let ref = getAccount(addr).getCapability<&{DappyContract.CollectionPublic}>(DappyContract.CollectionPublicPath).check()
//     return ref
//   }
// `