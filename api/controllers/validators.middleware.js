import { validationResult, body } from "express-validator";

// validateRequest works in conjunction with the 'express-validator' package. If we use the validations from
// 'express-validator', this middleware will check if any errors were thrown within the route and then
// return an appropriate error message to the API user.
const validator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      errors: errors.array(),
    });
  }
  next();
};

// TODO: migrate to fast validator
const saleItemValidation = [
  body("id").isDecimal(), 
  body("want_price").isDecimal(), 
  body("name").exists(),
  body("uri").exists(),
  body("description").exists(),
  body("seller_address", "something like 0xc88ff43f1a87c679")
    .matches('^0x[0-9a-zA-Z ]{16}$'), // something like  "0xc88ff43f1a87c679"
  body("uri", "something like https://ipfs.io/ipfs/bafybeih2xfiepfxicjy2qkfxktzmpbe6nx4mqfkalvbtajiwmdyb32kwk4")
    .matches(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)
]  

const myWArtValidation = [
  body("name").exists(),
  body("price").isDecimal(), 
  body("uri").exists(),
  body("description").exists(),
  body("address", "something like 0xc88ff43f1a87c679")
    .matches('^0x[0-9a-zA-Z ]{16}$'), // something like  "0xc88ff43f1a87c679"
  body("uri", "something like https://ipfs.io/ipfs/bafybeih2xfiepfxicjy2qkfxktzmpbe6nx4mqfkalvbtajiwmdyb32kwk4")
    .matches(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)
]  

export {validator, saleItemValidation, myWArtValidation};
