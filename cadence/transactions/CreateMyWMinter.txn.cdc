import MyW from "../contracts/MyW.cdc" 

transaction {
  
  let minterRef: &MyW.Minter?

  prepare (acct: AuthAccount) {
    let adminRef = acct.borrow<&MyW.Administrator>(from: MyW.MyWAdminPath) ?? panic("Could not borrow reference to MyW.Administrator")
    self.minterRef = acct.borrow<&MyW.Minter>(from: MyW.MyWMinterPath)
    if self.minterRef == nil {
      acct.save(<- adminRef.createNewMinter(), to: MyW.MyWMinterPath )
    }
  }
}