import React, { createContext, useContext } from 'react'

import useStorageArtwork from '../hooks/use-storage-artwork.hook'

const StorageContext = createContext()

export default function StorageProvider({ children }) {
  const { uploadArtwork } = useStorageArtwork()
  return (
    <StorageContext.Provider
      value={{
        uploadArtwork
      }}>
      {children}
    </StorageContext.Provider>
  )
}

export const useStorage = () => {
  return useContext(StorageContext) /* What is useContext and UserContext? */
}
