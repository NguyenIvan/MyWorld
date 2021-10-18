import React, { createContext, useContext } from 'react'

import useUserMyWArts from '../hooks/use-user-mywarts.hook'
import useGallery from '../hooks/use-gallery.hook'
import useCollection from '../hooks/use-collection.hook'
import useMyW from '../hooks/use-myw.hook'
import { useAuth } from './AuthProvider'

const UserContext = createContext()

export default function UserProvider({ children }) {
  const { user } = useAuth()
  const { collection, createCollection, deleteCollection } = useCollection(user)
  const { data: balance, createMyWVault, getMyWBalance } = useMyW(user)
  const { data: saleItems, fetchGallery } = useGallery()
  const { data: useMyarts, putForSale, purchaseMyWArt, mintMyWArt, queryMyWArtMintFee, testScript } = 
    useUserMyWArts(user, collection, getMyWBalance, fetchGallery)
  return (
    <UserContext.Provider
      value={{
        saleItems,
        useMyarts,
        putForSale,
        purchaseMyWArt,
        mintMyWArt,
        queryMyWArtMintFee,
        testScript,
        collection,
        createCollection,
        deleteCollection,
        balance,
        createMyWVault,
        getMyWBalance,
      }}>

      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
