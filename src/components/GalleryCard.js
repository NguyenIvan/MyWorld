import React from 'react'

import { useUser } from '../providers/UserProvider'
import "./MyArtCard.css"

export default function MyArtCard( {myWArt} ) {
  const { useMyarts, buyMyWArt } = useUser()
  const { id, name, want_price, uri } = myWArt
  const owned = useMyarts.some(d => d?.id === myWArt?.id) 
  //TODO: check owned for sale and allow user to withdraw

  const SellButton = () => (
    <div
      onClick={() => buyMyWArt(myWArt)}
      className="btn btn-bordered btn-light">
      <i className="ri-price-tag-3-fill btn-icon"></i> {parseInt(want_price)} FUSD
    </div>
  )
  
  return (

    <div className="myart-card__border">
      <div className={`myart-card__wrapper ${owned && "faded"}`} >
        <img className="myart-card__image img-large" src={ uri } alt="Art" />
        <br />
        <h3 className="myart-cart__title">{name}</h3>
        <p className="myart-card__info"># {id}</p>
      </div>
      <SellButton />
      {/* <div className="collected">For Sale</div> */}
    </div >

  )
}
