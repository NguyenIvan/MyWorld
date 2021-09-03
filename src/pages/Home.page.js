import React from 'react'
import { useHistory } from "react-router-dom"
import Header from '../components/Header'
import "./Home.page.css"

export default function Home() {
  const history = useHistory()

  return (
    <>
      <Header
        title={<><span className="highlight">My</span>World</>}
        subtitle={<>An NFT gallery of <span className="highlight">arts and music</span> for autism community</>}

      >
      </Header>
      <img className="header-image"
        alt="Header"
        onClick={() => history.push("/packs")}
        src={`${process.env.PUBLIC_URL}/assets/PinWheel.png`}
      />
      

    </>
  )
}
