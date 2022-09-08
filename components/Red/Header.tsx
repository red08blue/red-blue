import { useState } from 'react'
import Image from 'next/image'
import { AiOutlineUser, AiFillHome, AiFillMessage } from 'react-icons/ai'
import solanaLogo from '../../assets/sol.png'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import useWalletBalance from '../../context/useWalletBalance'
import Link from 'next/link'
import logo from "../../assets/logo.png"
import { BiLogOut } from 'react-icons/bi'
import { useStateValue } from '../../context/StateProvider'
import { actionTypes } from '../../context/reducer'
import { useRouter } from 'next/router'
require('@solana/wallet-adapter-react-ui/styles.css')

interface HeaderProps {
  name: string,
  url: string,
  isHome: boolean,
  isChat: boolean,
  isUsers: boolean,
}

const Header = ({ name, url, isHome, isChat, isUsers }: HeaderProps) => {
  const [balance] = useWalletBalance()

  const [{ user }, dispatch] = useStateValue()
  const router = useRouter()

  const loggout = () => {
    dispatch({
      type: actionTypes.SET_USER,
      user: []
    })

    router.push('/')
  }

  return (
    <div className="flex items-center w-full h-[4rem] justify-around px-[1rem] py-[0.2rem] bg-[#F6F6F6] shadow-[0px 5px 8px -9px rgba(0, 0, 0, 0.75)] z-20">
      <div className="flex h-min">
        {name.length > 0 && (
          <div className="bg-[#31e3bd] hover:bg-[#438791] flex items-center px-3 mx-2 rounded-[0.2rem] cursor-pointer">
            <Image
              src={url}
              height={20}
              width={20}
              className="rounded-full object-cover"
              alt='user image'
            />
            <div className="font-bold ml-2 text-black">{name}</div>
          </div>
        )}
        <WalletMultiButton />
        <div className="bg-[#ec55bc] hover:bg-[#572079] text-black flex items-center px-3 mx-2 rounded-[0.2rem] cursor-pointer">
          <Image
            className="object-covers"
            src={solanaLogo}
            height={20}
            width={20}
            alt='solana logo'
          />
          <div className="text-white font-bold ml-2">{balance.toFixed(2)} SOL</div>
        </div>
      </div>
      <div className="flex-[0.7] flex items-center justify-center h-full">
        <div className="flex justify-center h-full py-2">
          <Link href="/">
            <div className="flex items-center px-[1.8rem] mx-2 cursor-pointer duration-[0.5s]  hover:bg-[#f5a49e] rounded-[10px]">
              <AiFillHome className={`text-2xl ${isHome ? "text-red-500 border-2 border-spacing-1 border-red-500" : "text-[#666]"}`} />
            </div>
          </Link>
          <Link href="/chat">
            <div className="flex items-center px-[1.8rem] mx-2 cursor-pointer duration-[0.5s]  hover:bg-[#f5a49e] rounded-[10px]">
              <AiFillMessage className={`text-2xl ${isChat ? "text-red-500 border-2 border-spacing-1 border-red-500" : "text-[#666]"}`} />
            </div>
          </Link>
          <Link href="/users">
            <div className="flex items-center px-[1.8rem] mx-2 cursor-pointer duration-[0.5s]  hover:bg-[#f5a49e] rounded-[10px]">
              <AiOutlineUser className={`text-2xl ${isUsers ? "text-red-500 border-2 border-spacing-1 border-red-500" : "text-[#666]"}`} />
            </div>
          </Link>
        </div>
      </div>
      <div className="flex-[0.3] flex items-center justify-center gap-[0.6rem]">
        <BiLogOut
          className='text-2xl cursor-pointer'
          onClick={loggout}
        />
        <Image
          className="items-center flex object-contain"
          src={logo}
          alt='red-blue logo'
          height={70}
          width={70}
        />
      </div>
    </div>
  )
}

export default Header