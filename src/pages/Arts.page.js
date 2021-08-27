import React from 'react'

import useDappyTemplates from '../hooks/use-dappy-templates.hook'
import DappyList from '../components/DappyList'
import Header from '../components/Header'
import ErrorLoadingRenderer from '../components/ErrorLoadingRenderer'

export default function Dappies() {
  const { data: dappyTemplates, loading, error } = useDappyTemplates()

  return (
    <>
      <Header
        title={<><span className="highlight">MyWorld </span>Gallery</>}
        subtitle={<>Browse <span className="highlight">arts</span> in our gallery</>}
      />
      <ErrorLoadingRenderer loading={loading} error={error}>
        <DappyList dappies={dappyTemplates} store />
      </ErrorLoadingRenderer>
    </>
  )
}
