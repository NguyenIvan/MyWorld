import React from 'react'

import Header from '../components/Header'

export default function Artists() {
  return (
    <>
      <Header
        title={<><span className="highlight">Artists</span> Profile</>}
        subtitle={<>Our lens <span className="highlight">through</span> life</>}
      />
    </>
  )
}
