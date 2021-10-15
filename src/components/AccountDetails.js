import React from 'react'

import { useAuth } from '../providers/AuthProvider'
import { useUser } from '../providers/UserProvider'
import './AccountDetails.css'

export default function Wallet() {
  const { user, logOut } = useAuth()
  const { balance, createMyWVault } = useUser()

  return (
    <div className="wallet__popup">
      <div className="wallet__item">
        👛 {user?.addr}
      </div>
      {!balance ?
        <div className="btn btn-small" onClick={() => createMyWVault()}>
          ⚠️ Enable MyW Token
        </div>
        :
        <div className="wallet__item">
          💰 MyW: {balance.slice(0, -6)} <a style={{ color: "white" }} href="https://youtu.be/q8vcEGe95js">(Get Tokens)</a>
        </div>
      }
      <div className="btn btn-small" onClick={() => logOut()}>👋 Logout</div>
      {/* <div onClick={() => testScript()} className="btn btn-small">Test Script</div> */}
    </div>
  )
}
