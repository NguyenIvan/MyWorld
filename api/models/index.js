import { uri } from "../db.config.js";
import mongoose from "mongoose";
import createSaleCollection  from "./SaleCollection.model.js";

mongoose.Promise = global.Promise;

mongoose.set('debug', true)

const db = {};
db.mongoose = mongoose;
db.uri = uri;
db.saleCollection = createSaleCollection(mongoose);

export default db;