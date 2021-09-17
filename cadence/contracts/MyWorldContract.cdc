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
      // self.data = MyArtData(name: artData.name, price: artData.price)
      self.data = artData
    }
  }

  pub struct MyArtData {
    pub let name: String
    pub let price: UFix64
    pub let uri: String

    init (name: String, price: UFix64, uri: String) {
      self.name = name
      self.price = price
      self.uri = uri
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
      artData.uri.length >= 0 : "Art must have an uri"

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