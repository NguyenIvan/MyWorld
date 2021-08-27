import React from 'react'
export default function Header({ title, subtitle }) {
  return (
    <>
      <img src={`${process.env.PUBLIC_URL}/assets/MyWorld.png`} width="200px" alt="MyWorld" />
      <h1 className="app__title">{title}</h1>
      <h3 className="app__subtitle">{subtitle}</h3>
    </>
    
  )
}
