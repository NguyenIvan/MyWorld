import { useEffect, useReducer } from 'react'
import { mutate, query, tx } from '@onflow/fcl'

import { LIST_USER_DAPPIES } from '../flow/list-user-dappies.script'
import { MINT_DAPPY } from '../flow/mint-dappy.tx'
import { userDappyReducer } from '../reducer/userDappyReducer'
import { useTxs } from '../providers/TxProvider'
import DappyClass from '../utils/DappyClass'

export default function useUserDappies(user, collection, getFUSDBalance) { /* Stateful function  to get methods and properties of user */
  const [state, dispatch] = useReducer(userDappyReducer, {
    loading: false,
    error: false,
    data: []
  }) /* This dict is the stateful object. Each object has a reducer to keep state . This object use userDappyReducer */
  const { addTx, runningTxs } = useTxs()

  useEffect(() => { /* useEffect is use as a side effect after render or update of a component. It is used in replacement for DidMount and DidUpdate */
    const fetchUserDappies = async () => {
      dispatch({ type: 'PROCESSING' }) /* Dispatch is use to update statful object */
      try {
        let res = await query({
          cadence: LIST_USER_DAPPIES, /*Now it's the call to cadence to get list of dappies */
          args: (arg, t) => [arg(user?.addr, t.Address)]
        })
        let mappedDappies = [] /* and push them to an array of DappyClass*/

        for (let key in res) {
          const element = res[key]
          let dappy = new DappyClass(element.templateID, element.dna, element.name, element.price, key)
          mappedDappies.push(dappy)
        }

        dispatch({ type: 'SUCCESS', payload: mappedDappies })
      } catch (err) {
        dispatch({ type: 'ERROR' })
      }
    }
    fetchUserDappies()
    //eslint-disable-next-line
  }, [])

  const mintDappy = async (templateID, amount) => {  /* These functions are ways to change the stateful object */
    if (!collection) {
      alert("You need to enable the collection first. Go to the tab Collection")
      return
    }
    if (runningTxs) {
      alert("Transactions are still running. Please wait for them to finish first.")
      return
    }
    try {
      let res = await mutate({ /* What is mutate ?*/
        cadence: MINT_DAPPY,
        limit: 55,
        args: (arg, t) => [arg(templateID, t.UInt32), arg(amount, t.UFix64)] /* a function of (a function, a type dict) */
      })
      addTx(res)
      await tx(res).onceSealed()
      await addDappy(templateID)
      await getFUSDBalance()
    } catch (error) {
      console.log(error)
    }
  }

  const addDappy = async (templateID) => { /* Only called after a dappy is minted */
    try {
      let res = await query({
        cadence: LIST_USER_DAPPIES,
        args: (arg, t) => [arg(user?.addr, t.Address)]
      })
      const dappies = Object.values(res)
      const dappy = dappies.find(d => d?.templateID === templateID) /* Strict operand */
      const newDappy = new DappyClass(dappy.templateID, dappy.dna, dappy.name)
      dispatch({ type: 'ADD', payload: newDappy })
    } catch (err) {
      console.log(err)
    }
  }

  const batchAddDappies = async (dappies) => { /* Never called */
    try {
      let res = await query({
        cadence: LIST_USER_DAPPIES,
        args: (arg, t) => [arg(user?.addr, t.Address)]
      })
      const allDappies = Object.values(res)
      const dappyToAdd = allDappies.filter(d => dappies.includes(d?.templateID))
      const newDappies = dappyToAdd.map(d => new DappyClass(d.templateID, d.dna, d.name))
      for (let index = 0; index < newDappies.length; index++) {
        const element = newDappies[index];
        dispatch({ type: 'ADD', payload: element })
      }
    } catch (err) {
      console.log(err)
    }
  }

  return {
    ...state,
    mintDappy,
    addDappy,
    batchAddDappies
  }
}
