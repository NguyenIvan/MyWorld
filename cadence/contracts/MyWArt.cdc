import NonFungibleToken from "./NonFungibleToken.cdc"
import FungibleToken from "./FungibleToken.cdc"
import MyW from "./MyW.cdc"
// import NonFungibleToken from 0xf8d6e0586b0a20c7

pub contract MyWArt: NonFungibleToken {

    pub let MyWArtCollectionStoragePath: StoragePath

    pub let MyWArtCollectionPublicPath: PublicPath

    pub let MyWArtAdminPath: StoragePath

    pub let MinterCapabilityPrivatePath: PrivatePath

    pub let MinterProxyStoragePath: StoragePath

    pub let MinterProxyPublicPath: PublicPath

    pub let DefaultMintFee: UFix64

    pub var totalSupply: UInt64

    pub event MyWArtDestroyed(id: UInt64)

    pub event ContractInitialized()

    pub event MyWArtMinted(id: UInt64)

    pub event Withdraw(id: UInt64, from: Address?)

    pub event Deposit(id: UInt64, to: Address?)

    pub struct MyWArtData {
        pub let name: String
        pub let price: UFix64
        pub let uri: String
        pub let description: String

        init (name: String, price: UFix64, uri: String, description: String) {
        self.name = name
        self.price = price
        self.uri = uri
        self.description = description
        }
    }

    pub resource NFT: NonFungibleToken.INFT {

        pub let id: UInt64

        pub let data: MyWArtData

        pub init(data: MyWArtData) {
            MyWArt.totalSupply = MyWArt.totalSupply + UInt64(1)
            self.data = data
            self.id = MyWArt.totalSupply
            emit MyWArtMinted(id: self.id)
        }

        destroy() {
            emit MyWArtDestroyed(id: self.id)
        }

    }

    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {

        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        destroy() {
            destroy self.ownedNFTs
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT
        {
            let token <- self.ownedNFTs.remove(key: withdrawID) 
                ?? panic("Cannot withdraw: MyWArt does not exist in the collection")
 
            emit Withdraw(id: token.id, from:self.owner?.address)

            return <-token

        }

        pub fun deposit(token: @NonFungibleToken.NFT)
        {

            let token <- token as! @MyWArt.NFT

            let id = token.id

            let oldToken <- self.ownedNFTs[id] <- token

            if self.owner?.address != nil {
                emit Deposit(id: id, to: self.owner?.address)
            }

            destroy oldToken

        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        pub fun borrowArt(id: UInt64): &MyWArt.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
                return ref as! &MyWArt.NFT
            } else {
                return nil
            }
        }

    }

    // Admin is a special authorization resource that 
    // allows the owner to perform important functions to modify MyWArt information
    //
    pub resource Admin {

        // createNewAdmin creates a new Admin resource
        //
        pub fun mintMyWArt(data: MyWArtData, fee: @MyW.Vault): @NFT {
            pre {
                data.name.length >= 0 : "Art must have a name"
                data.price >=0.0 : "Art must have a price"
                data.uri.length >= 0 : "Art must have an uri"
                data.description.length >= 0 : "Art must have a description"
                fee.balance >= MyWArt.DefaultMintFee: "Could not mint art: payment balance insufficient."
            }
            destroy fee
            //TODO: deposit fee to the account receiver
            let newNFT: @NFT <- create NFT(data: data)
            return <- newNFT
        }

        pub fun createNewAdmin(): @Admin {
            return <-create Admin()
        }

    }   

    pub resource interface MinterProxyPublic {
        pub fun mintMyWArt(data: MyWArtData, fee: @MyW.Vault): @NFT
    }

    // MinterProxy
    //
    // Resource object holding a capability that can be used to mint new tokens.
    // The resource that this capability represents can be deleted by the admin
    // in order to unilaterally revoke minting capability if needed.

    pub resource MinterProxy: MinterProxyPublic {

        // access(self) so nobody else can copy the capability and use it.
        access(self) var minterCapability: Capability<&Admin>?

        // Anyone can call this, but only the admin can create Minter capabilities,
        // so the type system constrains this to being called by the admin.
        pub fun setMinterCapability(cap: Capability<&Admin>) {
            self.minterCapability = cap
        }

        pub fun mintMyWArt(data: MyWArtData, fee: @MyW.Vault): @NFT {
            
            return <- self.minterCapability!
            .borrow()!
            .mintMyWArt(data: data, fee: <-fee)

        }

        init() {
            self.minterCapability = nil
        }

    }

    pub fun createEmptyCollection(): @MyWArt.Collection {
        return <-create MyWArt.Collection()
    }

    pub init() {

        self.DefaultMintFee = 10.0
        self.totalSupply = 0
        self.MyWArtCollectionStoragePath = /storage/MyWArtCollection
        self.MyWArtCollectionPublicPath = /public/MyWArtCollection
        self.MinterProxyStoragePath = /storage/MyWArtMinterProxy
        self.MinterProxyPublicPath = /public/MyWArtMinterProxy
        self.MinterCapabilityPrivatePath = /private/MyWArtMinter

        // Put a new Collection in storage
        self.account.save<@Collection>(<- create Collection(), to: self.MyWArtCollectionStoragePath)

        // Create a public capability for the Collection
        self.account.link<&{NonFungibleToken.CollectionPublic}>(self.MyWArtCollectionPublicPath, target: self.MyWArtCollectionStoragePath)

        self.MyWArtAdminPath = /storage/MyWArtAdmin
        // Put the Minter in storage
        self.account.save<@Admin>(<- create Admin(), to: self.MyWArtAdminPath)

        let minterProxy <- create MinterProxy()
        minterProxy.setMinterCapability(cap:
            self.account.link<&Admin>(
                self.MinterCapabilityPrivatePath, target: self.MyWArtAdminPath) !
        )
        self.account.save<@MinterProxy>(<-minterProxy, to: self.MinterProxyStoragePath)
        self.account.link<&{MinterProxyPublic}>(self.MinterProxyPublicPath, target: self.MinterProxyStoragePath)

        emit ContractInitialized()

    }
}

 