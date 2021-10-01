import NonFungibleToken from "./NonFungibleToken.cdc"
pub contract MyWArt: NonFungibleToken {
    /* Fungible Token */

    pub init() {
        self.totalSupply = 1000000000

    }
}

 