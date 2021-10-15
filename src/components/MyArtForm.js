import React, { useState } from 'react'
import "./MyArtForm.css"
import { useInput } from '../hooks/use-input.hook'
import { useUser } from '../providers/UserProvider'
import { LazyIpfsImage } from 'lazy-ipfs-image'
import { useEffect } from 'react/cjs/react.development'
import { checkMyWArt } from '../utils/myworld.utils'


export default function MyArtForm() {
    const { mintMyWArt, queryMyWArtMintFee } = useUser()
    const { value: name, bind: bindName, reset: resetName } = useInput('');
    const { value: price, bind: bindPrice, reset: resetPrice } = useInput('');
    const { value: description, bind: bindDescription, reset: resetDescription } = useInput('');
    const [uri, setUri] = useState(null)
    const [mintMyWArtFee, setMintMyWArtFee] = useState(null);


    const params = {
        endpoint: process.env.REACT_APP_IPFS_END_POINT,
        token: process.env.REACT_APP_IPFS_API_KEY,
        ipfspath: process.env.REACT_APP_IPFS_PATH,
        setIpfsUri: (ipfsUri) => setUri(ipfsUri)
    }

    useEffect(() => {

        //TODO: move to use-user-mywarts.hook.js dispatch to reduce load
        (async () => {
            setMintMyWArtFee(await queryMyWArtMintFee());
        })()
        
    //eslint-disable-next-line
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault()

        let myWArt = {
            name,
            price,
            uri,
            description
        }
        // TODO: Remove! for testing only
        myWArt = {
            name: "Test",
            price: 100.00,
            uri: "https://ipfs.io/ipfs/bafkreih6qup2zmio7nf4anbwrthztahg7rb7rb7mghw4iyg6nkg32gpn3e",
            description: "Only for testing"
        }

        //TODO: checking and error report should be moved to hook layer for more robustness
        const msg = checkMyWArt( myWArt);

        if (msg === true) {

            // eslint-disable-next-line no-restricted-globals
            if ( confirm(
                `Minting myart: ` +
                `\n    name: ${myWArt.name},` +
                `\n    price: ${myWArt.price},` +
                `\n    uri: ${myWArt.uri},` +
                `\n    description: ${myWArt.description}` +
                `\nProceed?` ) ) 
            {
                await mintMyWArt(myWArt) // TODO: txn failed should be reported with meaningful errors
            }
        }
        else {
            let err = 'Error:';
            console.log(msg);
            msg.forEach(e => {
                err = `${err}\n${e.message}`;
            });
            alert(err)
        }

        resetName()
        resetPrice()
        resetDescription()
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
                    <div className="myart__form__item ">
                        <label>Description</label>
                        <input type="text" {...bindDescription} />
                    </div>
                    {/* <input className="btn btn-bg rounded" type="submit" value="3. Submit" /> */}
                    <div className="btn upload__btn btn-bg rounded" onClick={handleSubmit}>
                        3. Submit
                    </div>
                    <div>
                        * Mint Fee: { mintMyWArtFee ? mintMyWArtFee.slice(0, -6) : null }
                    </div>
                </form>
            </div>

        </>
    )
}


