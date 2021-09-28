import React from 'react'

import { useUser } from '../providers/UserProvider'
import "./MyArtCard.css"

export default function MyArtCard({ myart, store }) {
  const { useMyarts, putForSale } = useUser()
  const { id, name, price, uri } = myart
  const owned = useMyarts.some(d => d?.id === myart?.id)

  const SellButton = () => (
    <div
      onClick={() => putForSale(id, price)}
      className="btn btn-bordered btn-light">
      <i className="ri-price-tag-3-fill btn-icon"></i> {parseInt(price)} FUSD
    </div>
  )
  
  return (

    <div className="myart-card__border">
      <div className={`myart-card__wrapper ${owned && store && "faded"}`} >
        <img className="myart-card__image img-large" src={ uri } alt="Art" />
        <br />
        <h3 className="myart-cart__title">{name}</h3>
        <p className="myart-card__info"># {id}</p>
      </div>
      <SellButton />

      <div className="collected">Collected</div>
    </div >

  )
}
