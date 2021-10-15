import { findAll, findOne, create, deleteOne } from "../controllers/myworld.controller.js";
import express from "express";
import {validator, saleItemValidation} from "../controllers/validators.middleware.js";

const galleryRouter = express.Router()

// Retrieve all 
galleryRouter.get("/gallery", findAll);

// Retrieve a single item with id
galleryRouter.get("/gallery:id", findOne);

// New  MyWArt for Sale
galleryRouter.post("/gallery", saleItemValidation, validator, create)

// Delete
galleryRouter.delete("/gallery/:id", deleteOne)

export default galleryRouter;