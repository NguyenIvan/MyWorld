import MyW from  "./MyW.cdc"
import MyWArt from  "./MyWArt.cdc"
import NonFungibleToken from  "./NonFungibleToken.cdc"

pub contract MyWAdminReceiver {

    // storeAdmin takes a TopShot Admin resource and 
    // saves it to the account storage of the account
    // where the contract is deployed
    pub fun storeAdmin(newAdmin: @MyWArt.Admin) {
        self.account.save(<-newAdmin, to: /storage/MyWAdmin)
    }
    
    init() {
        // Save a copy of the MyWArt Collection to the account storage
        if self.account.borrow<&MyWArt.Collection>(from: /storage/MyWArtCollection) == nil {
            let collection <- MyWArt.createEmptyCollection()
            // Put a new Collection in storage
            self.account.save(<-collection, to: /storage/MyWArtCollection)

            self.account.link<&{NonFungibleToken.CollectionPublic}>(/public/MyWArtCollection, target: /storage/MyWArtCollection)
        }
    }
}
