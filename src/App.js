import React from 'react'

import Navbar from './components/Navbar'
import Providers from './providers/Providers.comp';
import Routes from './components/Routes.comp'
import { ROUTES } from './config/routes.config';
import Wallet from './components/AccountDetails';
// import Footer from './components/Footer';

export default function App() {
  return (
    <>
    <Providers>
      <Wallet />
      <Navbar />

      <Routes routes={ROUTES} />
    </Providers>
    {/* <Footer /> */}
    </>
  )
}
