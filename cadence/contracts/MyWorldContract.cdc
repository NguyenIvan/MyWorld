import FungibleToken from "./FungibleToken.cdc"
pub contract MyWorldContract {
  pub var totalArts: UInt64

  pub let CollectionStoragePath: StoragePath
  pub let CollectionPublicPath: PublicPath
  pub let AdminStoragePath: StoragePath  

  pub resource MyArt{
    pub let id: UInt64
    pub let data: MyArtData

    init(artData: MyArtData) {
      pre {
        artData.name.length > 0 : "Could not create MyArt: name is required."
        artData.price > 0.0 : "Could not create MyArt: price is required."
      }
      MyWorldContract.totalArts = MyWorldContract.totalArts + 1
      self.id = MyWorldContract.totalArts
      self.data = MyArtData(name: artData.name, price: artData.price)
    }
  }

  pub struct MyArtData {
    pub let name: String
    pub let price: UFix64
    init (name: String, price: UFix64) {
      self.name = name
      self.price = price
    }
  }

  pub resource Admin{
    pub fun approveMyArt() {
    }
  }

  pub resource interface CollectionPublic {
    pub fun deposit(token: @MyArt)
    pub fun getIDs(): [UInt64]
    pub fun listMyArts(): {UInt64: MyArtData}
  }

  pub resource interface Provider {
    pub fun withdraw(withdrawID: UInt64): @MyArt
  }

  pub resource interface Receiver {
    pub fun deposit(token: @MyArt)
  }

  pub resource Collection: CollectionPublic, Provider, Receiver {
    pub var ownedMyArts: @{UInt64: MyArt}

    pub fun withdraw(withdrawID: UInt64): @MyArt {
      let token <- self.ownedMyArts.remove(key: withdrawID) 
        ?? panic("Could not withdraw MyArt: MyArt does not exist in collection")
      return <-token
    }

    pub fun deposit(token: @MyArt) {
      let oldToken <-self.ownedMyArts[token.id] <- token
      destroy  oldToken
    }

    pub fun getIDs(): [UInt64] {
      return self.ownedMyArts.keys
    }

    pub fun listMyArts(): {UInt64: MyArtData} {
      var myArts: {UInt64: MyArtData} = {}
      for key in self.ownedMyArts.keys {
        let el = &self.ownedMyArts[key] as &MyArt
        myArts.insert(key: el.id, el.data)
      }
      return myArts
    }

    destroy() {
      destroy self.ownedMyArts
    }

    init() {
      self.ownedMyArts <- {}
    }
  }

  pub fun createEmptyCollection(): @Collection {
    return <-create self.Collection()
  }

  pub fun mintMyArt(artData: MyArtData, paymentVault: @FungibleToken.Vault): @MyArt {
    pre {
      artData.name.length >= 0 : "Art must have a name"
      artData.price >=0.0 : "Art must have a price"
      paymentVault.balance >= artData.price: "Could not mint art: payment balance insufficient."
    }
    destroy paymentVault
    return <- create MyArt(artData: artData)
  }

  init() {
    self.totalArts = 0 
    self.CollectionStoragePath = /storage/MyArtCollection
    self.CollectionPublicPath = /public/MyArtCollectionPublic
    self.AdminStoragePath = /storage/MyArtAdmin
    self.account.save<@Admin>(<- create Admin(), to: self.AdminStoragePath)
  }
  
}

/* 
(R) MyArt - or MA - is the most important piece of MyWorldContract. 
- MA is  minted by a registered address
- MA need to be approved to be listed
- MA belong to a person's collection
- Property of MA: Id -> Incremental, Price -> MyW, IPFS Storage(V0.1) || /public/assets/MyArtDefault.png
This is how MA collection is created (by AuthAccout)

transaction {
    prepare(acct: AuthAccount) {
      let collection <- DappyContract.createEmptyCollection()
      acct.save<@DappyContract.Collection>(<-collection, to: DappyContract.CollectionStoragePath)
      acct.link<&{DappyContract.CollectionPublic}>(DappyContract.CollectionPublicPath, target: DappyContract.CollectionStoragePath)
    }
  }

This is how an MA is minted in exchange for a Vault and deposit to an AuthAccount (receiver interface)

execute {
  let newDappy <- DappyContract.mintDappy(templateID: templateID, paymentVault: <-self.sentVault)
  self.receiverReference.deposit(token: <-newDappy)
}

People can mint MA with a vault. By the time of minting they should have:
- A balance of FUSD >= mintFee
- A name for his or her arts
- A price set for his or her arts
- Approval from Admin (V0.1)

There should be a test for this cadence code

*/


/*
DappyContract most important piece is (R) Dappy. Dappy is minted only on a template, which consist of price, dna and name. The length of a dna decide the price of the Dappy. How ever if the Dappy is minted from a (R) Family, its price is up to the family preset price.
Admin has all the rights to the objects in DappyContract and is exposed outside, especially with Template and Family.
Collection is exposed through /public/DappyCollection/Public expose basic ops: deposit, withdraw, list dappies.
Each Dappy has an ID (incremental when created, in tandem with dappyTotal in the contract) and data from which template it was created from.
There is a minor struct FamilyReport that help add an abstract layer between Family objects and public (could be replace with an Interface easily).
*/
 