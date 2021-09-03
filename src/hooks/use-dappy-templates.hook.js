import { useEffect, useReducer } from 'react'
import { query, config } from '@onflow/fcl'

import { LIST_SALE_COLLECTION } from '../flow/list-sale-collection.script'
import { defaultReducer } from '../reducer/defaultReducer'
import { useAuth } from '../providers/AuthProvider'
import DappyClass from '../utils/DappyClass'

export default function useDappyTemplates() { // TODO: find all name with Dappy and subs it with MyW
  const [state, dispatch] = useReducer(defaultReducer, { loading: false, error: false, data: [] })
  const { user, logOut } = useAuth()
  useEffect(() => {
    const fetchDappyTemplates = async () => {
      dispatch({ type: 'PROCESSING' })
      try {
        const address = await config().get("0xMyWorld")
        if (address) {
          console.log("0xMyWorld is undefined in config.js")
          return
        }
        let res = await query({ 
          cadence: LIST_SALE_COLLECTION,
          args: (arg, t) => [arg(address, t.Address)] 
        })
        // fix dna
        let mappedDappies = Object.keys(res).map( key => {
          const dna =  "FF5A9D.FFE922.60C5E5.0"
          return new DappyClass(key, res[key].name, dna, res[key].price) // TODO: should be wantPrice, remove bellow
        } )

        // let mappedDappies = Object.values(res).map(d => {
        //   return new DappyClass(d?.templateID, d?.dna, d?.name, d?.price)
        // })
        dispatch({ type: 'SUCCESS', payload: mappedDappies })
      } catch (err) {
        dispatch({ type: 'ERROR' })
      }
    }
    fetchDappyTemplates()
  }, [])

  return state
}
