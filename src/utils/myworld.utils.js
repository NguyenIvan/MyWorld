import axios from "axios";
import Validator from 'fastest-validator'

const http = axios.create({
  baseURL: "http://very:5000/api/v1",
  headers: {
    "Content-type": "application/json"
  }
});

const v = new Validator();

const schemaMyWArt = {

    name: {type: "string", min: 3, max: 255},
    price: { type: "number", positive: true, integer: false },
    description: { type: "string", min: 3, max: 255 },
    uri: {
        type: "url",
        messages: {
            required: "An artwork must be uploaded",
            url: "Url is not in correct format"

        }
    }

}
const checkMyWArt = v.compile(schemaMyWArt)


export {http, checkMyWArt };

