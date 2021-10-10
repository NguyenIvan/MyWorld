import React from 'react'

import GalleryCard from './GalleryCard'
import './MyArtList.css'

export default function SaleCollection( {saleItems} ) {

  return (
    <div className="myart-list__wrapper">
      {saleItems.map((myWArt, i) => (
        <GalleryCard
          key = {i}
          myWArt={myWArt}
        />
      ))
      }
    </div>
  )

}
