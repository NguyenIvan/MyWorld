import React from 'react'

const importAll = (r)  => {
    return r.keys().map(r)
  }

const images = importAll(require.context('../../public/arts/', false, /\.(png|jpe?g|svg)$/));

export const getRandomImgSrc = () => { 
    return images[Math.floor(Math.random() * images.length)].default
}