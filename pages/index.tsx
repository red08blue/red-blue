import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Blue from '../components/Blue'
import Footer from '../components/Footer'
import Red from '../components/Red'
import Auth from '../components/Auth'
import { useStateValue } from '../context/StateProvider'

const Home: NextPage = () => {

  const [{ user }, dispatch] = useStateValue()

  return (
    <div className="overflow-hidden">
      <Head>
        <title>Red-Blue App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center text-center">
        {user.length > 0 ? (
          user[0].type === "Blue" ? <Blue
            name={user[0].name}
            url={user[0].profileImage}
          />
            : <Red
              name={user[0].name}
              url={user[0].profileImage}
            />
        ) : (
          <Auth />
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Home
