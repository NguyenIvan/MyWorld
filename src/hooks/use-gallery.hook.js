import { useEffect, useReducer } from 'react'

import { mutate, query } from '@onflow/fcl'
import { LIST_SALE_COLLECTION } from '../flow/list-sale-collection.script'
import MyArtClass from '../utils/MyArtClass'
import { defaultReducer } from '../reducer/defaultReducer'

export default function useGallery() { /* Stateful function  to get methods and properties of user */

  const [state, dispatch] = useReducer(defaultReducer, {
    loading: false,
    error: false,
    data: [] // data will be renamed 
  })
  
  useEffect(() => { 
 
    const fetchMyArts = async () => {
      dispatch({ type: 'PROCESSING' })
      try {
        const marketplaceAddress = process.env.REACT_APP_MYMARKETPLACE_CONTRACT
        let res = await query({
          cadence: LIST_SALE_COLLECTION,
          args: (arg, t) => [arg(marketplaceAddress, t.Address)]
        })

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

  return {
    ...state,
  }

}
