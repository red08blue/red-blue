import { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import BlueChat from '../components/Blue/BlueChat'
import Footer from '../components/Footer'
import RedChat from '../components/Red/RedChat'
import { useStateValue } from '../context/StateProvider'

const chat: NextPage = () => {

  const [{ user }, dispatch] = useStateValue()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title>Red-Blue Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        {/*<main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">*/}
        {user.length > 0 &&
          (user[0].type === "Blue"
            ? <BlueChat
              name={user[0].name}
              url={user[0].profileImage}
            />
            : <RedChat
              name={user[0].name}
              url={user[0].profileImage}
            />
          )}

      </>
      <Footer />
    </div>
  )
}

export default chat