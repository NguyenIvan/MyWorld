import db from "../models/index.js";

const mint = (req, res) => {
  // Create a model
  const art = new db.MyWArt({

    id: req.body.id,
    name: req.body.name,
    uri: req.body.uri,
    price: req.body.want_price,
    description: req.body.description

  });
    
}

const create = (req, res) => {

  // Create a model
  const art = new db.saleCollection({

    id: req.body.id,
    name: req.body.name,
    uri: req.body.uri,
    description: req.body.description,
    want_price: req.body.want_price,
    seller_address: req.body.seller_address,
    seller_name: req.body.seller_name

  });

  // Save MyWArt in the database
  art
    .save(art)
    .then(data => {
      res.send(data);
    })
    .catch(err => {

      res.status(500).send({
        message:
          err.message || "Some error occurred while list item for sale."
      });
      console.log(err);

    });
}

const deleteOne = (req, res) => {
  const id = req.params.id;
  var condition = Number(id) ? { id: Number(id) } : {id: false} ;
  db.saleCollection.findOneAndDelete(condition)
    .then(data => {
      if (!data) {
        res.status(400).send(
          `Cannot delete item with id=${id}`
        );
      } else {
        res.send({
          message: "Item was deleted successfully!",
          data: data
        });
      }
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
      console.log(err);
    });
}
// Retrieve all from the database.
const findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  db.saleCollection.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
      console.log(err);
    });

}

// Find a single item with an id
const findOne = (req, res) => {
  const id = req.params.id;

  db.saleCollection.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found a sale item with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving sale item with id=" + id });
      console.log(err);
    });
}

export { create, findOne, findAll, deleteOne };
