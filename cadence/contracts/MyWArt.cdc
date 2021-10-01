// import NonFungibleToken from "./NonFungibleToken.cdc"
import NonFungibleToken from 0xf8d6e0586b0a20c7

pub contract MyWArt: NonFungibleToken {

    pub var totalSupply: UInt64

    pub event ContractInitialized()

    pub event Withdraw(id: UInt64, from: Address?)

    pub event Deposit(id: UInt64, to: Address?)

    pub resource NFT: NonFungibleToken.INFT {

        pub let id: UInt64

        pub init() {
            MyWArt.totalSupply = MyWArt.totalSupply + UInt64(1)
            self.id = MyWArt.totalSupply
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

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <-create MyWArt.Collection()
    }

    pub init() {

        self.totalSupply = 0

    }
}

 