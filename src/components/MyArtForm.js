import React from 'react'
import "./MyArtForm.css"
import { useInput } from '../hooks/use-input.hook'
import { useUser } from '../providers/UserProvider'

export default function MyArtForm() {
    const { mintMyArt } = useUser()
    const { value: name, bind: bindName, reset: resetName } = useInput('');
    const { value: price, bind: bindPrice, reset: resetPrice } = useInput('');

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (name && price) {
            // eslint-disable-next-line no-restricted-globals
            if (confirm(`Minting myart: ${name}, price: ${price}. Process?`)) {
                const fixed = parseFloat(price).toFixed(8)
                await mintMyArt(name, fixed) // TODO: txn failed should be reported with meaningful errors
            }
        }
        else {
            alert(`Enter both name and price`)
        }

        resetName()
        resetPrice()
    }

    return (
        <form className="myart__form" onSubmit={handleSubmit}>
            <div className="myart__form__border dappy-card__border">
                <div className="dappy-card__title">Mint Your Art</div>
                <div className="myart__form__item ">
                    <label>Name</label>
                    <input type="text" {...bindName} />
                </div>
                <div className="myart__form__item ">
                    <label>Price</label>
                    <input type="number" step=".01" {...bindPrice} />
                </div>
                <div className="myart__form__item designer__form__item">
                    <input type="submit" value="Submit" />
                </div>
            </div>
        </form>
    )
}


