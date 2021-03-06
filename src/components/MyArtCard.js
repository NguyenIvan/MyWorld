import React, { useState } from 'react'
import { useInput } from '../hooks/use-input.hook'
import { useUser } from '../providers/UserProvider'
import { useAuth } from '../providers/AuthProvider'
import "./MyArtCard.css"

export default function MyArtCard({ myart, store }) {

  const { useMyarts, putForSale } = useUser()

  const { id, name, price, uri } = myart

  const { user } = useAuth();

  const owned = useMyarts.some(d => d?.id === myart?.id)

  const { value: want_price, bind: bindPrice, reset: resetPrice } = useInput(price.slice(0, -6));

  const { value: seller_name, bind: bindArtist, reset: resetArtist } = useInput("Anonymous");

  const [sell, setSell] = useState(false);

  const clickShow = () => {

    setSell(!sell);

  }

  const clickSell = () => {

    myart.want_price = want_price;
    myart.seller_name = seller_name;
    myart.seller_address = user.addr;
    
    putForSale( myart );
    
  }

  return (

    <div className="myart-card__border">
      <div className={`myart-card__wrapper ${owned && store && "faded"}`} >
        <img className="myart-card__image img-large" src={uri} alt="Art" />
        <br />
        <h3 className="myart-cart__title">{name}</h3>
        <p className="myart-card__info"># {id}</p>
      </div>

      {/* Sell Button */}
      <div
        className="btn btn-bordered btn-light">
        <div onClick={() => clickShow()}>
          <i className="ri-price-tag-3-fill btn-icon"></i> {parseInt(price)} MyW
        </div>
        {sell &&
          <>
            <div className="myart__form__item ">
              <label>Price</label>
              <input type="number" step=".01" {...bindPrice} />
            </div>
            <div className="myart__form__item ">
              <label>Artist Name (optional)</label>
              <input type="text" {...bindArtist} />
            </div>
            <div className="btn upload__btn btn-bg rounded" onClick={() => clickSell()}>Put for sale</div>
          </>
        }
      </div>

      <div className="collected">Collected</div>
    </div >

  )
}
