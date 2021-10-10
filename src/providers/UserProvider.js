import React, { createContext, useContext } from 'react'

import useUserMyArts from '../hooks/use-user-myarts.hook'
import useGallery from '../hooks/use-gallery.hook'
import useCollection from '../hooks/use-collection.hook'
import useFUSD from '../hooks/use-fusd.hook'
import { useAuth } from './AuthProvider'

const UserContext = createContext()

export default function UserProvider({ children }) {
  const { user } = useAuth()
  const { collection, createCollection, deleteCollection } = useCollection(user)
  const { data: balance, createFUSDVault, getFUSDBalance } = useFUSD(user)
  const { data: saleItems, fetchGallery } = useGallery()
  const { data: useMyarts, putForSale, buyMyWArt, mintMyArt, testScript } = 
    useUserMyArts(user, collection, getFUSDBalance, fetchGallery)
  return (
    <UserContext.Provider
      value={{
        saleItems,
        useMyarts,
        putForSale,
        buyMyWArt,
        mintMyArt,
        collection,
        createCollection,
        deleteCollection,
        balance,
        createFUSDVault,
        getFUSDBalance,
        testScript
      }}>

      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
