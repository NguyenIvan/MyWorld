import axios from "axios";

const importAll = (r)  => {
    return r.keys().map(r)
  };

const images = importAll(require.context('../../public/arts/', false, /\.(png|jpe?g|svg)$/));

const getRandomImgSrc = () => { 
    return images[Math.floor(Math.random() * images.length)].default
};

const http = axios.create({
  baseURL: "http://very:5000/api/v1",
  headers: {
    "Content-type": "application/json"
  }
});

export {http, getRandomImgSrc};
