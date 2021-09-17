export const CHECK_COLLECTION = `
import MyWorldContract from 0xMyWorld

pub fun main(addr: Address): Bool {
  let ref = getAccount(addr).getCapability<&{MyWorldContract.CollectionPublic}>(MyWorldContract.CollectionPublicPath).check()
  return ref
}
`