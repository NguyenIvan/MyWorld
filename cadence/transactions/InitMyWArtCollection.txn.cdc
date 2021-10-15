import MyW from "../contracts/MyW.cdc"
import MyWArt from "../contracts/MyWArt.cdc"
import MyWMarket from "../contracts/MyWMarket.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc" 

transaction(){

    prepare(acct: AuthAccount) {

        if acct.borrow<&MyWArt.Collection>(from: MyWArt.MyWArtCollectionStoragePath) == nil {

            // Put a new Collection in storage
            acct.save<@MyWArt.Collection>(
                <- MyWArt.createEmptyCollection(), 
                to: MyWArt.MyWArtCollectionStoragePath
            )

            // Create a public capability for the Collection
            acct.link<&{NonFungibleToken.CollectionPublic}>(
                MyWArt.MyWArtCollectionPublicPath, 
                target: MyWArt.MyWArtCollectionStoragePath
            )

        }

        if acct.borrow<&MyWMarket.SaleCollection>(from: MyWMarket.MyWSaleCollectionPath) == nil {

        
            // Where to deposit sale revenue to
            let ownerCapability = acct
                .getCapability(MyW.MyWVaultReceiver)

            // Where to deposit sale cut to
            let broker = getAccount(MyWMarket.DefaultBeneficiaryAddress)
            let beneficiaryCapability = broker
                .getCapability(MyW.MyWVaultReceiver)

            // Let's stick with default cut
            let cutPercentage = MyWMarket.DefaultCutPercentage


            let saleCollection <- MyWMarket.createEmptySaleCollection(
                ownerCapability: ownerCapability,
                beneficiaryCapability: beneficiaryCapability,
                cutPercentage: cutPercentage
            )

            // Put a new SaleCollection in storage
            acct.save<@MyWMarket.SaleCollection>(
                <- saleCollection, 
                to: MyWMarket.MyWSaleCollectionPath
            )

            // Create a public capability for the SaleCollection
            acct.link<&{MyWMarket.SalePublic}>(
                MyWMarket.MyWSalePublicPath, 
                target: MyWMarket.MyWSaleCollectionPath
            )

        }

    }

}