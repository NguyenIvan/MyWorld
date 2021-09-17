import { useEffect, useReducer } from 'react'
import { mutate, query, tx } from '@onflow/fcl'

import { LIST_USER_MYARTS } from '../flow/list-user-myarts.script'
import { PUT_MYART_FOR_SALE } from '../flow/put-myart-for-sale.tx'
import { MINT_MYART } from '../flow/mint-myart.tx'
import { userMyArtReducer } from '../reducer/userMyArtReducer'
import { useTxs } from '../providers/TxProvider'
import MyArtClass from '../utils/MyArtClass'

export default function useUserMyArts(user, collection, getFUSDBalance, fetchGallery) { /* Stateful function  to get methods and properties of user */
  const [state, dispatch] = useReducer(userMyArtReducer, {
    loading: false,
    error: false,
    data: [] // data will be renamed to useUserMyArts
  })
  const { addTx, runningTxs } = useTxs()

  const fetchMyArts = async () => {
    dispatch({ type: 'PROCESSING' }) /* Dispatch is use to update statful object */
    try {
      let res = await query({
        cadence: LIST_USER_MYARTS, /*Now it's the call to cadence to get list of myart */
        args: (arg, t) => [arg(user?.addr, t.Address)]
      })

      // fix dna
      let myarts = Object.keys(res).map(key => {
        return new MyArtClass(key, res[key].name, res[key].price, res[key].uri) // TODO: should be wantPrice, remove bellow
      })

      dispatch({ type: 'SUCCESS', payload: myarts })
    } catch (err) {
      dispatch({ type: 'ERROR' })
    }
  }

  useEffect(() => { /* useEffect is use as a side effect after render or update of a component. It is used in replacement for DidMount and DidUpdate */
    fetchMyArts()
    //eslint-disable-next-line
  }, [])

  const putForSale = async (id, price) => {
    if (runningTxs) {
      alert("Transactions are still running. Please wait for them to finish first.")
      return
    }
    try  {
      const wantPrice = parseFloat(price).toFixed(8)
      const adminAddress =  process.env.REACT_APP_MYMARKETPLACE_CONTRACT
      const artId = parseInt(id)
      let res = await mutate({
        cadence: PUT_MYART_FOR_SALE,
        limit: 55,
        args: (arg, t) => [arg(adminAddress, t.Address), arg(artId, t.UInt64), arg(wantPrice, t.UFix64)]
      })
      addTx(res)
      await tx(res).onceSealed()
      await getFUSDBalance()
      fetchMyArts()
      fetchGallery()
    }
    catch (error) {
      console.log(error)
    }
  
  }
  const mintMyArt = async (name, price, uri) => {  /* These functions are ways to change the stateful object */
    if (!collection) {
      alert("You need to enable the collection first. Go to the tab Collection")
      return
    }
    if (runningTxs) {
      alert("Transactions are still running. Please wait for them to finish first.")
      return
    }
    try {
      let res = await mutate({
        cadence: MINT_MYART,
        limit: 55,
        args: (arg, t) => [
          arg(name, t.String), 
          arg(price, t.UFix64),
          arg(uri, t.String)
        ]
      })
      addTx(res)
      await tx(res).onceSealed()
      await getFUSDBalance()
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
    mintMyArt,
    testScript
  }
}
