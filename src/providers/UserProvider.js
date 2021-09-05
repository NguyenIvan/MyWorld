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
  const { data: userDappies, putForSale, mintMyArt, testScript } = useUserMyArts(user, collection, getFUSDBalance)
  const { data: saleItems } = useGallery()
  return (
    <UserContext.Provider
      value={{
        saleItems,
        userDappies,
        putForSale,
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
  return useContext(UserContext) /* What is useContext and UserContext? */
}
