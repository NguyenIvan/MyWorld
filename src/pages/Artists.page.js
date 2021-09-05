import React from 'react'

import Header from '../components/Header'
import ErrorLoadingRenderer from '../components/ErrorLoadingRenderer'
import useDappyPacks from '../hooks/use-dappy-packs.hook'


export default function Artists() {
  const { loading, error } = useDappyPacks()
  return (
    <>
      <Header
        title={<><span className="highlight">Artists</span> Profile</>}
        subtitle={<>Our lens <span className="highlight">through</span> life</>}
      />
      <ErrorLoadingRenderer loading={loading} error={error}>
        
      </ErrorLoadingRenderer>
    </>
  )
}
