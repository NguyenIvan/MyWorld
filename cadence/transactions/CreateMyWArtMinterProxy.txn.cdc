import MyWArt from "../contracts/MyWArt.cdc"

transaction() {

    prepare (acct: AuthAccount) {       
        let minterProxy <- MyWArt.createMinterProxy()
        minterProxy.setMinterCapability(cap:
            acct.link<&MyWArt.Admin>(
                MyWArt.MinterCapabilityPrivatePath, target: MyWArt.MyWArtAdminPath) !
        )
        acct.save<@MyWArt.MinterProxy>(<-minterProxy, to: MyWArt.MinterProxyStoragePath)

        acct.link<&MyWArt.MinterProxy{MyWArt.MinterProxyPublic}>(
            MyWArt.MinterProxyPublicPath, 
            target: MyWArt.MinterProxyStoragePath
        )

    }

}