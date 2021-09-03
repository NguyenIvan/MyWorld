export const LIST_USER_MYARTS = `
  import MyWorldContract from 0xMyWorld

  pub fun main(addr: Address): {UInt64: MyWorldContract.MyArtData}? {
    let account = getAccount(addr)
    
    if let ref = account.getCapability<&{MyWorldContract.CollectionPublic}>(MyWorldContract.CollectionPublicPath)
                .borrow() {
                  let myArts = ref.listMyArts()
                  return myArts
                }
    
    return nil
  }
`