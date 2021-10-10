import React from 'react'

import SaleCollection from '../components/SaleCollection'
import { useUser } from '../providers/UserProvider'
import Header from '../components/Header'

export default function Gallery() {
  const  { saleItems } = useUser()
  return (
    <>
      <Header
        title={<><span className="highlight">MyWorld </span>Gallery</>}
        subtitle={<>Browse <span className="highlight">arts</span> in our gallery</>}
      />
      <SaleCollection saleItems={ saleItems } />
    </>
  )
}
