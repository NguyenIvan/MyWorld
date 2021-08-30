import MyWorldContract from "../contracts/MyWorldContract.cdc"


transaction {
    let collectionRef: &MyWorldContract.Collection
    prepare(seller: AuthAccount) {
        self.collectionRef = seller.borrow<&MyWorldContract.Collection>
            (from: MyWorldContract.CollectionStoragePath)
                ?? panic("Cannot borrow reference")     
    }
}