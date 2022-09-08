import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Blue from '../components/Blue'
import Footer from '../components/Footer'
import Red from '../components/Red'
import Auth from '../components/Auth'
import { useStateValue } from '../context/StateProvider'



// windows
// 3f6UTpsvfTrNAnNQShEFp6VUV7sC9SCFV1L242LD2e4V
// cradle annual display clap isolate hamster chalk game carpet ginger observe minimum

// debian
// 3JwVXVXwi8hav5MsBxHj96Kar7wuUfsRwj4ePur9b5vk
//rice voice pass target hawk calm peasant rotate source peanut define stamp

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
