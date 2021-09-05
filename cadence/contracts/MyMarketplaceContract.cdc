import FungibleToken from "./FungibleToken.cdc"
import MyWorldContract from "./MyWorldContract.cdc"

pub contract MyMarketplaceContract {
  pub event ForSale(id: UInt64, wantPrice: UFix64)

  pub event PriceChanged(id: UInt64, newPrice: UFix64)

  pub event TokenPurchased(id: UInt64, salePrice: UFix64)

  pub event SaleWithdrawn(id: UInt64)

  pub let SaleCollectionPublicPath: PublicPath

  pub let SaleCollectionStoragePath: StoragePath

  init() {
    self.SaleCollectionStoragePath = /storage/SaleCollection
    self.SaleCollectionPublicPath = /public/SaleCollectionPublic

    let adminAccount = self.account
    let ownerVault = adminAccount.getCapability<&AnyResource{FungibleToken.Receiver}>(/public/fusdReceiver)
    let saleCollection <- self.createSaleCollection(ownerVault: ownerVault)

    /* link storage and public link with sale collection*/
    adminAccount.save<@SaleCollection>(<-saleCollection, to: self.SaleCollectionStoragePath)
    adminAccount.link<&SaleCollection{SalePublic}>(self.SaleCollectionPublicPath, target:self.SaleCollectionStoragePath)
  }

  pub resource interface SalePublic {
    pub fun purchase(tokenID: UInt64, recipient: &AnyResource{MyWorldContract.Receiver}, buyTokens: @FungibleToken.Vault)
    pub fun idPrice(tokenID: UInt64): UFix64?
    pub fun getIDs(): [UInt64]
    pub fun getCollection(): {UInt64: MyWorldContract.MyArtData}
    pub fun putForSale(token: @MyWorldContract.MyArt, wantPrice: UFix64)
  }

  pub resource SaleCollection: SalePublic {

    pub var forSale: @{UInt64: MyWorldContract.MyArt}

    pub var collection: {UInt64: MyWorldContract.MyArtData}

    pub var wantPrices: {UInt64: UFix64}

    access(account) let ownerVault: Capability<&AnyResource{FungibleToken.Receiver}>

    init (vault: Capability<&AnyResource{FungibleToken.Receiver}>) {
      self.forSale <- {}
      self.ownerVault = vault
      self.wantPrices = {}  
      self.collection = {}
    }

    pub fun withdraw(tokenID: UInt64): @MyWorldContract.MyArt {
      self.wantPrices.remove(key: tokenID)
      self.collection.remove(key: tokenID)
      let token <- self.forSale.remove(key:tokenID) ?? panic("missing MyArt NFT")
      return <- token
    }

    pub fun putForSale(token: @MyWorldContract.MyArt, wantPrice: UFix64) {
      let id = token.id
      self.wantPrices[id] = wantPrice
      self.collection[id ] = token.data
      let oldToken <- self.forSale[id] <- token 
      destroy  oldToken
      emit ForSale(id: id, wantPrice: wantPrice)
    }

    pub fun changePrice(tokenID: UInt64, newPrice: UFix64) {
      self.wantPrices[tokenID] = newPrice
      emit PriceChanged(id: tokenID, newPrice: newPrice)
    }

    pub fun purchase(tokenID: UInt64, recipient: &AnyResource{MyWorldContract.Receiver}, buyTokens: @FungibleToken.Vault) {
        pre {
          self.forSale[tokenID] != nil && self.wantPrices[tokenID] != nil: 
            "No token matching this ID for sale!"
          buyTokens.balance >= (self.wantPrices[tokenID] ?? 0.0):
            "Not enough tokens to by the NFT!"
        }

        let price = self.wantPrices[tokenID]!
        self.wantPrices[tokenID] = nil
        self.collection[tokenID] = nil
        let vaultRef = self.ownerVault.borrow()
          ?? panic("Could not borrow reference to owner token vault")
        vaultRef.deposit(from: <-buyTokens)
        recipient.deposit(token: <-self.withdraw(tokenID: tokenID))
        emit TokenPurchased(id: tokenID, salePrice: price)
    }

    pub fun idPrice(tokenID: UInt64): UFix64? {
        return self.wantPrices[tokenID]
    }

    pub fun getIDs(): [UInt64] {
        return self.forSale.keys
    }

    pub fun getCollection(): {UInt64: MyWorldContract.MyArtData} {
      return self.collection    
    }

    destroy() {
      destroy self.forSale
    }


  }

  pub fun createSaleCollection(ownerVault: Capability<&AnyResource{FungibleToken.Receiver}>): @SaleCollection
  {
    return <- create SaleCollection(vault: ownerVault)
  }

}

/* 
A decentralized market place where owners can list their MyArts for sale
*/
 