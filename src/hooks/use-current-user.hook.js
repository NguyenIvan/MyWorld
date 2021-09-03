import { useEffect, useState } from 'react'
import * as fcl from "@onflow/fcl"
import fs from 'fs'
import path from 'path'
export default function useCurrentUser() {
  const [user, setUser] = useState()

  const tools = {
    logIn: fcl.authenticate,
    logOut: fcl.unauthenticate,
  }

  useEffect(() => {

    let cancel = false
    if (!cancel) {
      fcl.currentUser().subscribe(setUser)
    }
    return () => {
      cancel = true
    }
  }, [])

  return [user, user?.addr != null, tools]
}
