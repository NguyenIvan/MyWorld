import { useEffect, useReducer } from 'react'
import { mutate, query, tx } from '@onflow/fcl'
import GalleryData from '../utils/GalleryData.class'

import { LIST_USER_MYARTS as LIST_USER_MYWARTS } from '../flow/list-user-myarts.script'
import { PUT_MYART_FOR_SALE } from '../flow/put-myart-for-sale.tx'
import { PURCHASE_MYWART } from '../flow/purchase-mywart.tx'
import { MINT_MYWART } from '../flow/mint-mywart.tx'
import { userMyArtReducer } from '../reducer/userMyArtReducer'
import { useTxs } from '../providers/TxProvider'

export default function useUserMyWArts(user, collection, getMyWBalance, fetchGallery) { 
  /* Stateful function  to get methods and properties of user */

   const [state, dispatch] = useReducer(userMyArtReducer, {
    loading: false,
    error: false,
    data: [] // data will be renamed to useUserMyArts
  })
  const { addTx, runningTxs } = useTxs()

  const queryMyWArtMintFee = async () => {
    const script =`
      import MyWArt from 0xMyWArtContract
      pub fun main(): UFix64 {
        return MyWArt.DefaultMintFee
      }
    `
    let res = await query({
      cadence: script
    })

    return res;

  }

  const fetchMyArts = async () => {

    console.log(user);

    // Dispatch is use to update statful object
    dispatch({ type: 'PROCESSING' }) 

    try {

      const address = user.addr

      const data = await query({
        
        cadence: LIST_USER_MYWARTS,
        limit: 55,
        args: (arg, t) => [arg(address, t.Address)]
        
      })

      console.log(data)

      const myWArts = []
      for (var id in data) if (data.hasOwnProperty(id)) {
        data[id].id = id
        myWArts.push(data[id])
      }

      dispatch({ type: 'SUCCESS', payload: myWArts })

    } catch (err) {

      console.log(err)
      dispatch({ type: 'ERROR' })

    }

  }

  useEffect(() => { /* useEffect is use as a side effect after render or update of a component. It is used in replacement for DidMount and DidUpdate */
    
    fetchMyArts();

    //eslint-disable-next-line
  }, []);

  const purchaseMyWArt = async (myWArt) => { //TODO: Strong type here

    // TODO: Enable collection error?

    if (runningTxs) {
      alert("Transactions are still running. Please wait for them to finish first.")
      return
    }
    try  {

      const { id, seller_address } = myWArt
      const artId = parseInt(id)
      const sellerAddress = seller_address
      let res = await mutate({
        cadence: PURCHASE_MYWART,
        limit: 200,
        args: (arg, t) => [
          arg(artId, t.UInt64),
          arg(sellerAddress, t.Address)
        ]
      })

      GalleryData.delete(artId)
        .then( () => {
          fetchMyArts()
          fetchGallery()
        })
        .catch( e => {
          console.log(e);
        })
      
      addTx(res)
      await tx(res).onceSealed()
      await getMyWBalance()

    }
    catch (error) {
      console.log(error)
    }
  
  }

  const putForSale = async (data) => {
    if (runningTxs) {
      alert("Transactions are still running. Please wait for them to finish first.")
      return
    }
    try  {

      const { id, want_price } = data
      const wantPrice = parseFloat(want_price).toFixed(8)
      const artId = parseInt(id)
      let res = await mutate({
        cadence: PUT_MYART_FOR_SALE,
        limit: 55,
        args: (arg, t) => [
          arg(artId, t.UInt64), 
          arg(wantPrice, t.UFix64)
        ]
      })

      GalleryData.create(data)
        .then( () => {
          fetchMyArts()
        })
        .catch( e => {
          console.log(e);
        })
      
      addTx(res)
      await tx(res).onceSealed()
      await getMyWBalance()

      // TODO: Just remove one art and add that to gallery

      fetchGallery()

    }
    catch (error) {
      console.log(error)
    }
  
  }
  const mintMyWArt = async (data) => {  

    //TODO: Change to strong type
    if (!collection) {
      alert("You need to enable the collection first. Go to the tab Collection")
      return
    }
    if (runningTxs) {
      alert("Transactions are still running. Please wait for them to finish first.")
      return
    }

    const {name, price, uri, description } = data

    const fixed_price = parseFloat(price).toFixed(8);

    const minter = process.env.REACT_APP_MYWART_CONTRACT

    try {

      let res = await mutate({

        cadence: MINT_MYWART,
        limit: 100,
        args: (arg, t) => [
          arg(name, t.String), 
          arg(fixed_price, t.UFix64),
          arg(uri, t.String),
          arg(description, t.String),
          arg(minter, t.Address),
        ]
        
      })

      addTx(res)

      await tx(res).onceSealed()
      await getMyWBalance()
      await fetchMyArts()

    }
    catch (error) {
      console.log(error)
    }

  }

  const testScript = async () => {
    const script =`
      pub fun main(): AnyStruct {
        return true
      }
    `
    let res = await query({
      cadence: script
    })
    console.log(res)
  }

  return {
    ...state,
    putForSale,
    mintMyWArt,
    testScript,
    purchaseMyWArt,
    queryMyWArtMintFee
  }
}
