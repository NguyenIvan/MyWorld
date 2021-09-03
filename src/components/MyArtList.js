import React from 'react'

import MyArtCard from './MyArtCard'
import './MyArtList.css'
import MyArtForm from './MyArtForm'


export default function MyArtList({ myarts }) {

  return (
    <div className="dappy-list__wrapper">
      {myarts.map((myart, i) => (
        <MyArtCard
          key={i}
          myart={myart}
        />
      ))
      }
      <div className="dappy-card__border">
        <div className="dappy-card__wrapper">
          <MyArtForm />
        </div>
      </div>
    </div>
  )
}
