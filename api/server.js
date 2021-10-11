import express, { json, urlencoded } from "express";
import cors from "cors";
import db from ".//models/index.js";
import galleryRouter from ".//routes/gallery.routes.js";

const app = express();

var corsOptions = {
  origin: "http://very:4000" //TODO: change this to frontend
};

app.use(cors(corsOptions));

app.use(json())
app.use(urlencoded({
    extended: true
}))


db.mongoose
  .connect(db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

const collections = Object.keys(db.mongoose.connection.collections);
console.log(collections)

// simple route
app.get("/", (req, res) => {
  res.json({ message: "nope" });
});

app.use('/api/v1', galleryRouter);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});