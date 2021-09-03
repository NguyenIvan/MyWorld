import React from 'react'

import MyArtList from '../components/MyArtList'
import { useUser } from '../providers/UserProvider'
import Header from '../components/Header'

export default function Dappies() {
  const { userDappies } = useUser()
  /* Change the name of prop from data to dappyTemplates */
  return (
    <>
      <Header
        title={<><span className="highlight">MyWorld </span>Gallery</>}
        subtitle={<>Browse <span className="highlight">arts</span> in our gallery</>}
      />
      <MyArtList myarts={userDappies} />
    </>
  )
}
