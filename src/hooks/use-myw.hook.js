import { useEffect, useReducer } from 'react'
import { CREATE_MYW_VAULT } from '../flow/create-myw-vault.tx';
import { GET_MYW_BALANCE } from '../flow/get-myw-balance.script';
import { defaultReducer } from '../reducer/defaultReducer'
import { query, mutate, tx } from '@onflow/fcl'
import { useTxs } from '../providers/TxProvider'

export default function useMyW(user) {
  const [state, dispatch] = useReducer(defaultReducer, {
    loading: true,
    error: false,
    data: null
  }) /* This object use defaultReducer */
  const { addTx } = useTxs()

  useEffect(() => {
    getMyWBalance();
    //eslint-disable-next-line 
  }, [])

  const getMyWBalance = async () => {
    dispatch({ type: 'PROCESSING' })

    try {
      let response = await query({
        cadence: GET_MYW_BALANCE,
        args: (arg, t) => [
          arg(user?.addr, t.Address)
        ]
      })
      dispatch({ type: 'SUCCESS', payload: response })
    } catch (err) {
      dispatch({ type: 'ERROR' })
      console.log(err)
    }
  }

  const createMyWVault = async () => {
    dispatch({ type: 'PROCESSING' })
    try {
      let transaction = await mutate({
        cadence: CREATE_MYW_VAULT,
        limit: 100
      })
      addTx(transaction)
      await tx(transaction).onceSealed()
      dispatch({ type: 'SUCCESS', })
      getMyWBalance()
    } catch (err) {
      console.log(err)
      dispatch({ type: 'ERROR' })
    }
  }

  return {
    ...state,
    createMyWVault,
    getMyWBalance
  }
}
