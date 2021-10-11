import MyWArtSchema from "./MyWArt.model.js";

const modelName = "SaleCollection";

const SaleCollectionSchema = MyWArtSchema.clone().add(
    {
      want_price: Number,
      seller_address: String,
      seller_name: String
    }
);


// SaleCollectionSchema.set('collection', modelName);

const createSaleCollection = mongoose => mongoose.model(
    modelName,
    SaleCollectionSchema
  );

export default createSaleCollection;
