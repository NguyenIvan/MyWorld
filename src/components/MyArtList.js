import React from 'react'

import MyArtCard from './MyArtCard'
import './MyArtList.css'
import MyArtForm from './MyArtForm'


export default function MyArtList({ myarts }) {

  return (
    <div className="myart-list__wrapper">
      {myarts.map((myart, i) => (
        <MyArtCard
          key={i}
          myart={myart}
        />
      ))
      }
      <MyArtForm />
    </div>
  )
}
