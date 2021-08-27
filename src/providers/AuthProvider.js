import React, { createContext, useContext } from 'react'

import useCurrentUser from '../hooks/use-current-user.hook'
import Header from '../components/Header'

const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, loggedIn, tools] = useCurrentUser()

  if (!user || !loggedIn) return (
    <>
      <Header
        title={<><span className="highlight">My</span>World</>}
        subtitle={<>An NFT gallery of <span className="highlight">arts and music</span> for autism community</>}
      />
      <div
        style={{ display: "inline-block" }}
        className="btn btn-bg rounded"
        onClick={() => tools?.logIn()}>
        Sign In to start
      </div>
    </>
  )

  return (
    <AuthContext.Provider value={{
      user,
      loggedIn,
      ...tools
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
