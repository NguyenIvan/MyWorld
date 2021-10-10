import FungibleToken from "./FungibleToken.cdc"
import NonFungibleToken from "./NonFungibleToken.cdc"
import MyWArt from  "./MyWArt.cdc"
import MyW from  "./MyW.cdc"
// import FungibleToken from 0xf8d6e0586b0a20c7
// import NonFungibleToken from 0xf8d6e0586b0a20c7
// import MyWArt from  0xf8d6e0586b0a20c7
// import MyW from  0xf8d6e0586b0a20c7

pub contract MyWMarket {

    // emitted when an Art is listed for sale
    pub event MyWArtListed(id: UInt64, price: UFix64, seller: Address?)
    // emitted when the price of a listed Art has changed
    pub event MyWArtPriceChanged(id: UInt64, newPrice: UFix64, seller: Address?)
    // emitted when a token is purchased from the market
    pub event MyWArtPurchased(id: UInt64, price: UFix64, seller: Address?)
    // emitted when an Art has been withdrawn from the sale
    pub event MyWArtWithdrawn(id: UInt64, owner: Address?)
    // emitted when the cut percentage of the sale has been changed by the owner
    pub event CutPercentageChanged(newPercent: UFix64, seller: Address?)

    pub resource interface SalePublic {
        pub var cutPercentage: UFix64
        pub fun purchase(tokenID: UInt64, buyTokens: @FungibleToken.Vault): @MyWArt.NFT {
            post {
                result.id == tokenID: "The ID of the withdrawn token must be the same as the requested ID"
            }
        }
        pub fun getPrice(tokenID: UInt64): UFix64?
        pub fun getIDs(): [UInt64]
        pub fun borrowArt(id: UInt64): &MyWArt.NFT? {
            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrow Art reference: The ID of the returned reference is incorrect"
            }
        }
    }

    pub resource  SaleCollection: SalePublic{

        access(self) var forSale: @MyWArt.Collection

        access(self) var prices: {UInt64: UFix64}

        access(self) var beneficiaryCapability: Capability
        
        access(self) var ownerCapability: Capability

        pub var cutPercentage: UFix64

        init (ownerCapability: Capability, beneficiaryCapability: Capability, cutPercentage: UFix64) {
            pre {
                // Check that both capabilities are for fungible token Vault receivers
                ownerCapability.borrow<&{FungibleToken.Receiver}>() != nil: 
                    "Owner's Receiver Capability is invalid!"
                beneficiaryCapability.borrow<&{FungibleToken.Receiver}>() != nil: 
                    "Beneficiary's Receiver Capability is invalid!" 
            }

            self.forSale <- MyWArt.createEmptyCollection()
            self.ownerCapability = ownerCapability
            self.beneficiaryCapability = beneficiaryCapability
            // prices are initially empty because there are no Arts for sale
            self.prices = {}
            self.cutPercentage = cutPercentage
        }

        pub fun listForSale(token: @MyWArt.NFT, price: UFix64) {
            // get the ID of the token
            let id = token.id

            // Set the token's price
            self.prices[token.id] = price

            // Deposit the token into the sale collection
            self.forSale.deposit(token: <-token)

            emit MyWArtListed(id: id, price: price, seller: self.owner?.address)
        }

        pub fun withdraw(tokenID: UInt64): @MyWArt.NFT {

            // Remove and return the token.
            // Will revert if the token doesn't exist
            let token <- self.forSale.withdraw(withdrawID: tokenID) as! @MyWArt.NFT

            // Remove the price from the prices dictionary
            self.prices.remove(key: tokenID)

            // Set prices to nil for the withdrawn ID
            self.prices[tokenID] = nil
            
            // Emit the event for withdrawing an Art from the Sale
            emit MyWArtWithdrawn(id: token.id, owner: self.owner?.address)

            // Return the withdrawn token
            return <-token
        }

        pub fun purchase(tokenID: UInt64, buyTokens: @FungibleToken.Vault): @MyWArt.NFT {
            pre {
                self.forSale.ownedNFTs[tokenID] != nil && self.prices[tokenID] != nil:
                    "No token matching this ID for sale!"           
                buyTokens.balance == (self.prices[tokenID] ?? UFix64(0)):
                    "Not enough tokens to buy the NFT!"
            }

            // Read the price for the token
            let price = self.prices[tokenID]!

            // Set the price for the token to nil
            self.prices[tokenID] = nil

            // Take the cut of the tokens that the beneficiary gets from the sent tokens
            let beneficiaryCut <- buyTokens.withdraw(amount: price*self.cutPercentage)

            // Deposit it into the beneficiary's Vault
            self.beneficiaryCapability.borrow<&{FungibleToken.Receiver}>()!
                .deposit(from: <-beneficiaryCut)
            
            // Deposit the remaining tokens into the owners vault
            self.ownerCapability.borrow<&{FungibleToken.Receiver}>()!
                .deposit(from: <-buyTokens)

            emit MyWArtPurchased(id: tokenID, price: price, seller: self.owner?.address)

            // Return the purchased token
            return <-self.withdraw(tokenID: tokenID)
        }

        pub fun changePrice(tokenID: UInt64, newPrice: UFix64) {
            pre {
                self.prices[tokenID] != nil: "Cannot change the price for a token that is not for sale"
            }
            // Set the new price
            self.prices[tokenID] = newPrice

            emit MyWArtPriceChanged(id: tokenID, newPrice: newPrice, seller: self.owner?.address)
        }

        pub fun changePercentage(_ newPercent: UFix64) {
            pre {
                newPercent <= 1.0: "Cannot set cut percentage to greater than 100%"
            }
            self.cutPercentage = newPercent

            emit CutPercentageChanged(newPercent: newPercent, seller: self.owner?.address)
        }

        pub fun changeOwnerReceiver(_ newOwnerCapability: Capability) {
            pre {
                newOwnerCapability.borrow<&{FungibleToken.Receiver}>() != nil: 
                    "Owner's Receiver Capability is invalid!"
            }
            self.ownerCapability = newOwnerCapability
        }

        pub fun changeBeneficiaryReceiver(_ newBeneficiaryCapability: Capability) {
            pre {
                newBeneficiaryCapability.borrow<&{FungibleToken.Receiver}>() != nil: 
                    "Beneficiary's Receiver Capability is invalid!" 
            }
            self.beneficiaryCapability = newBeneficiaryCapability
        }

        pub fun getPrice(tokenID: UInt64): UFix64? {
            return self.prices[tokenID]
        }

        // getIDs returns an array of token IDs that are for sale
        pub fun getIDs(): [UInt64] {
            return self.forSale.getIDs()
        }

        pub fun borrowArt(id: UInt64): &MyWArt.NFT? {
            let ref = self.forSale.borrowArt(id: id)
            return ref
        }

        // If the sale collection is destroyed, 
        // destroy the tokens that are for sale inside of it
        destroy() {
            destroy self.forSale
        }        
    }

    pub fun createSaleCollection(ownerCapability: Capability, beneficiaryCapability: Capability, cutPercentage: UFix64): @SaleCollection {
        return <- create SaleCollection(ownerCapability: ownerCapability, beneficiaryCapability: beneficiaryCapability, cutPercentage: cutPercentage)
    }

}