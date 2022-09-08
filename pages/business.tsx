import { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import BlueBusiness from '../components/Blue/BlueBusiness'
import Footer from '../components/Footer'
import { useStateValue } from '../context/StateProvider'

const business: NextPage = () => {

  const [{ user }, dispatch] = useStateValue()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Red-Blue Business</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {user.length > 0 && <BlueBusiness
        name={user[0].name}
        url={user[0].profileImage}
      />}

      <Footer />
    </div>
  )
}

export default business