import React from 'react'

import { useUser } from '../providers/UserProvider'
import "./MyArtCard.css"

export default function MyArtCard({ myWArt }) {
  const { useMyarts, purchaseMyWArt } = useUser()
  const { id, name, want_price, uri, description, seller_address, seller_name } = myWArt
  const owned = useMyarts.some(d => d?.id === myWArt?.id)
  //TODO: check owned for sale and allow user to withdraw

  const SellButton = () => (
    <div
      onClick={() => purchaseMyWArt(myWArt)}
      className="btn btn-bordered btn-light">
      <i className="ri-price-tag-3-fill btn-icon"></i> {parseInt(want_price)} FUSD
    </div>
  )

  return (

    <div className="myart-card__border">
      <div className={`myart-card__wrapper ${owned && "faded"}`} >
        <img className="myart-card__image img-large" src={uri} alt="Art" />
        <br />
        <h3 className="myart-cart__title">{name}</h3>
        <div className="myart-card__info">ID: # {id}</div>
        {description &&
          <div className="myart-card__info">Description {description}</div>
        }
        <div className="myart-card__info">Seller: 
          {seller_name && <span>{seller_name } @ </span>}
          {seller_address}
        </div>
        
        <p className="myart-card__info">ID: # {id}</p>
      </div>
      <SellButton />
      {/* <div className="collected">For Sale</div> */}
    </div >

  )
}
