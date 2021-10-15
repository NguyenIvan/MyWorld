export const CHECK_COLLECTION = `
import MyWArt from 0xMyWArtContract
import NonFungibleToken from 0xNonFungibleTokenContract

pub fun main(addr: Address): Bool {
  let ref = getAccount(addr).getCapability<&{NonFungibleToken.CollectionPublic}>(MyWArt.MyWArtCollectionPublicPath).check()
  return ref
}
`