import React from 'react'

import GalleryCard from './GalleryCard'
import './MyArtList.css'

export default function SaleCollection({ myarts }) {

  return (
    <div className="myart-list__wrapper">
      {myarts.map((myart, i) => (
        <GalleryCard
          key={i}
          myart={myart}
        />
      ))
      }
    </div>
  )
}
