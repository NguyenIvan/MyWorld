import React from 'react'
import MyArtList from '../components/MyArtList'
import Header from '../components/Header'
import { useUser } from '../providers/UserProvider'

export default function Collection() {
  const { collection, createCollection, deleteCollection, userDappies } = useUser()

  return (
    <>
      <Header
        title={<>MyWorld <span className="highlight">Collection</span></>}
        subtitle={<>Here are your <span className="highlight">Arts</span> collection</>}
      />

      {!collection ?
        <div className="btn btn-bg rounded" onClick={() => createCollection()}>Enable Collection</div> :
        <>
          <MyArtList myarts={userDappies} />
          <div className="btn btn-bg rounded" onClick={() => deleteCollection()}>Delete Collection</div>
        </>
      }
    </>
  )
}
