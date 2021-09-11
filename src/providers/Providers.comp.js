import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import UserProvider from "./UserProvider"
import TxProvider from './TxProvider'
import AuthProvider from './AuthProvider'
import StorageProvider from './StorageProvider'

export default function Providers({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TxProvider>
          <UserProvider>
            <StorageProvider>
              <div className="app">
                {children}
              </div>
            </StorageProvider>
          </UserProvider>
        </TxProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
