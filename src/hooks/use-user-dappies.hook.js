import { useEffect, useReducer } from 'react'
import { mutate, query, tx } from '@onflow/fcl'

import { LIST_USER_MYARTS } from '../flow/list-user-myarts.script'
import { MINT_DAPPY } from '../flow/mint-dappy.tx'
import { MINT_MYART } from '../flow/mint-myart.tx'
import { userDappyReducer } from '../reducer/userDappyReducer'
import { useTxs } from '../providers/TxProvider'
import DappyClass from '../utils/DappyClass'
import MyArtClass from '../utils/MyArtClass'

export default function useUserMyArts(user, collection, getFUSDBalance) { /* Stateful function  to get methods and properties of user */
  const [state, dispatch] = useReducer(userDappyReducer, {
    loading: false,
    error: false,
    data: [] // data will be renamed to userDappies
  })
  const { addTx, runningTxs } = useTxs()

  useEffect(() => { /* useEffect is use as a side effect after render or update of a component. It is used in replacement for DidMount and DidUpdate */
    const fetchMyArts = async () => {
      dispatch({ type: 'PROCESSING' }) /* Dispatch is use to update statful object */
      try {
        let res = await query({
          cadence: LIST_USER_MYARTS, /*Now it's the call to cadence to get list of dappies */
          args: (arg, t) => [arg(user?.addr, t.Address)]
        })

        // fix dna
        let myarts = Object.keys(res).map(key => {
          return new MyArtClass(key, res[key].name, res[key].price) // TODO: should be wantPrice, remove bellow
        })

        dispatch({ type: 'SUCCESS', payload: myarts })
      } catch (err) {
        dispatch({ type: 'ERROR' })
      }
    }
    fetchMyArts()
    //eslint-disable-next-line
  }, [])

  const listForSale = async (id) => {
    
  }
  const mintMyArt = async (name, price) => {  /* These functions are ways to change the stateful object */
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
        args: (arg, t) => [arg(name, t.String), arg(price, t.UFix64)]
      })
      addTx(res)
      await tx(res).onceSealed()
      /* TODO: should update collection here */
      await getFUSDBalance()
    }
    catch (error) {
      console.log(error)
    }
  }

  const addDappy = async (id) => { /* Only called after a MyArt is minted */
    try {
      let res = await query({
        cadence: LIST_USER_MYARTS,
        args: (arg, t) => [arg(user?.addr, t.Address)]
      })
      const art = res[id]
      const dna = "FF5A9D.FFE922.60C5E5.0"
      const newArt = new DappyClass(art.id, dna, art.name, art.price)
      dispatch({ type: 'ADD', payload: newArt })
    } catch (err) {
      console.log(err)
    }
  }

  const testScript = async () => {
    const script =
      `import MyWorldContract from 0xMyWorld

    pub fun main(addr: Address): {UInt64: MyWorldContract.MyArtData}? {
      let account = getAccount(addr)
      
      if let ref = account.getCapability<&{MyWorldContract.CollectionPublic}>(MyWorldContract.CollectionPublicPath)
                  .borrow() {
                    let myArts = ref.listMyArts()
                    return myArts
                  }
      
      return {}
    }`
    let res = await query({
      cadence: script, /*Now it's the call to cadence to get list of dappies */
      args: (arg, t) => [arg("0x179b6b1cb6755e31", t.Address)]
    })
    console.log(res)
  }

  return {
    ...state,
    listForSale,
    mintMyArt,
    addDappy,
    testScript
  }
}
