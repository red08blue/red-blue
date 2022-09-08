import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
//import { TwitterContext } from '../context/TwitterContext'
import SidebarOption from './SidebarOption'
import { RiHome7Line, RiHome7Fill, RiFileList2Fill } from 'react-icons/ri'
import { BiHash } from 'react-icons/bi'
import { FiBell, FiMoreHorizontal } from 'react-icons/fi'
import { HiOutlineMail, HiMail } from 'react-icons/hi'
import { FaRegListAlt, FaHashtag, FaBell } from 'react-icons/fa'
import { CgMoreO } from 'react-icons/cg'
import {
  BsBookmark,
  BsBookmarkFill,
  BsPerson,
  BsPersonFill,
} from 'react-icons/bs'
import Logo from "../../assets/logo.png"
import Image from 'next/image'
import { useStateValue } from '../../context/StateProvider'
import { actionTypes } from '../../context/reducer'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import solanaLogo from '../../assets/sol.png'
import useWalletBalance from '../../context/useWalletBalance'
require('@solana/wallet-adapter-react-ui/styles.css')

const style = {
  wrapper: `flex-[0.3] px-8 flex flex-col`,
  twitterIconContainer: `text-3xl m-4`,
  tweetButton: `bg-[#1d9bf0] hover:bg-[#1b8cd8] flex items-center justify-center font-bold rounded-3xl h-[50px] mt-[20px] cursor-pointer`,
  navContainer: `flex-1`,
  profileButton: `flex items-center mb-6 cursor-pointer hover:bg-[#333c45] rounded-[100px] p-2`,
  profileLeft: `flex item-center justify-center mr-4`,
  profileImage: `height-12 w-12 rounded-full`,
  profileRight: `flex-1 flex`,
  details: `flex-1`,
  name: `text-lg`,
  handle: `text-[#8899a6]`,
  moreContainer: `flex items-center mr-2`,
}

interface SidebarProps {
  initialSelectedIcon: string
}

function Sidebar({ initialSelectedIcon }: SidebarProps) {
  const [selected, setSelected] = useState<String>(initialSelectedIcon)
  const router = useRouter()


  const [balance] = useWalletBalance()

  const [{ user }, dispatch] = useStateValue()

  const loggout = () => {
    dispatch({
      type: actionTypes.SET_USER,
      user: []
    })

    router.push('/')
  }

  return (
    <div className={style.wrapper}>
      <div className={style.twitterIconContainer}>
        <Image
          src={Logo}
          alt='red-blue logo'
          height={55}
          width={70}
        />
      </div>
      <div className={style.navContainer}>
        <SidebarOption
          Icon={selected === 'Home' ? RiHome7Fill : RiHome7Line}
          text='Home'
          isActive={Boolean(selected === 'Home')}
          setSelected={setSelected}
          redirect={'/'}
        />
        <SidebarOption
          Icon={selected === 'Chat' ? HiMail : HiOutlineMail}
          text='Chat'
          isActive={Boolean(selected === 'Chat')}
          setSelected={setSelected}
          redirect="/chat"
        />
        <SidebarOption
          Icon={selected === 'Business' ? RiFileList2Fill : FaRegListAlt}
          text='Business'
          isActive={Boolean(selected === 'Business')}
          setSelected={setSelected}
          redirect="/business"
        />
        <SidebarOption
          Icon={selected === 'Users' ? BsPersonFill : BsPerson}
          text='Users'
          isActive={Boolean(selected === 'Users')}
          setSelected={setSelected}
          redirect={'/users'}
        />
        <WalletMultiButton />
        <div className="bg-[#ec55bc] hover:bg-[#572079] text-black flex items-center justify-center font-bold rounded-3xl h-[50px] mt-[20px] cursor-pointer">
          <Image
            className="object-covers"
            src={solanaLogo}
            height={20}
            width={20}
            alt='solana logo'
          />
          <div className="text-white font-bold ml-2">{balance.toFixed(2)} SOL</div>
        </div>
        <div
          onClick={loggout}
          className={style.tweetButton}>
          Logout
        </div>
      </div>
    </div>
  )
}

export default Sidebar