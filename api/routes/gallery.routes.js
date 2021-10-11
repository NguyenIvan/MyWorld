import { findAll, findOne, create, deleteOne } from "../controllers/myworld.controller.js";
import express from "express";
import {validator, myWArtValidation} from "../controllers/validator.middleware.js";

const galleryRouter = express.Router()

// Retrieve all 
galleryRouter.get("/", findAll);

// Retrieve a single item with id
galleryRouter.get("/:id", findOne);

// New  MyWArt for Sale
galleryRouter.post("/", myWArtValidation, validator, create)

// Delete
galleryRouter.delete("/:id", deleteOne)

export default galleryRouter;