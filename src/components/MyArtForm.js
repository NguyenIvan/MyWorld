import React, { useState } from 'react'
import "./MyArtForm.css"
import { useInput } from '../hooks/use-input.hook'
import { useUser } from '../providers/UserProvider'
import { LazyIpfsImage } from 'lazy-ipfs-image'


export default function MyArtForm() {
    const { mintMyArt } = useUser()
    const { value: name, bind: bindName, reset: resetName } = useInput('');
    const { value: price, bind: bindPrice, reset: resetPrice } = useInput('');
    const [uri, setUri] = useState(null)

    const params = {
        endpoint: process.env.REACT_APP_IPFS_END_POINT,
        token: process.env.REACT_APP_IPFS_API_KEY,
        ipfspath: process.env.REACT_APP_IPFS_PATH,
        setIpfsUri: (ipfsUri) => setUri(ipfsUri)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (name && price && uri) {
            // eslint-disable-next-line no-restricted-globals
            if (confirm(`Minting myart: ${name}, price: ${price}, uri: ${uri} \n Process?`)) {
                const fixed = parseFloat(price).toFixed(8)
                await mintMyArt(name, fixed, uri) // TODO: txn failed should be reported with meaningful errors
            }
        }
        else {
            alert(`Enter name, price and upload arwork`)
        }

        resetName()
        resetPrice()
    }

    return (
        <>
            <div className="myart__form__border">
                <div className="myart-cart__title">Mint Your Art</div>
                <form className="myart__form">
                    <LazyIpfsImage {...params} />
                    <div className="myart__form__item ">
                        <label>Name</label>
                        <input type="text" {...bindName} />
                    </div>
                    <div className="myart__form__item ">
                        <label>Price</label>
                        <input type="number" step=".01" {...bindPrice} />
                    </div>
                    {/* <input className="btn btn-bg rounded" type="submit" value="3. Submit" /> */}
                    <div className="btn upload__btn btn-bg rounded" onClick={handleSubmit}>
                        3. Submit
                    </div>
                </form>
            </div>

        </>
    )
}


