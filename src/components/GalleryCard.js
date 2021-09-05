import React from 'react'

import { useUser } from '../providers/UserProvider'
import "./MyArtCard.css"
import  { getRandomImgSrc }  from '../utils/myworld.utils'


export default function MyArtCard({ myart, store, designer }) {
  const { userDappies, putForSale } = useUser()
  const { id, image, name, price } = myart
  const owned = userDappies.some(d => d?.id === myart?.id)

  const SellButton = () => (
    <div
      onClick={() => putForSale(id, price)}
      className="btn btn-bordered btn-light btn-dappy">
      <i className="ri-price-tag-3-fill btn-icon"></i> {parseInt(price)} FUSD
    </div>
  )
  
  /* Check: if type is Dappy, render Dappy with dna, if NOT, render a pack image */
  return (

    <div className="dappy-card__border">
      <div className={`dappy-card__wrapper ${owned && store && "faded"}`} >
        <img className="dappy-card__image img-large" src={ image? image: getRandomImgSrc() } alt="Art" />
        <br />
        <h3 className="dappy-card__title">{name}</h3>
        <p className="dappy-card__info"># {id}</p>
      </div>
      <SellButton />

      <div className="collected">Collected</div>
    </div >

  )
}
