import React, { Dispatch, SetStateAction, useState } from 'react'
import Image from 'next/image'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import logo from '../assets/logo.png'
import { useStateValue } from '../context/StateProvider'
import { actionTypes } from '../context/reducer'

const options = [
    {
        label: "Red",
        value: "Red",
    },
    {
        label: "Blue",
        value: "Blue",
    }
]

const Auth = () => {

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [type, setType] = useState("Red")

    const wallet = useWallet()

    const [{ user }, dispatch] = useStateValue()

    const createUser = async () => {

        await fetch(`/api/createUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userWalletAddress: wallet.publicKey,
                name: name,
                profileImage: `https://avatars.dicebear.com/api/pixel-art-neutral/${Math.floor(
                    Math.random() * 100,
                )}.svg`,
                password: password,
                type: type
            }),
        }).then(() => setUserData())
            .catch(e => console.log(e))
    }

    const loginUser = async () => {
        const response = await fetch(`/api/getUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: wallet.publicKey
            }),
        })

        const data = await response.json()
        return data.data
    }

    const authenticate = async (event: any) => {
        event.preventDefault()

        const info = await loginUser()

        if (info.length > 0) {
            if (info[0].name !== name) {
                alert("error in name")
            } else if (info[0].password !== password) {
                alert("error in password")
            } else {
                setUserData()
            }
        } else {
            createUser()
        }
    }

    const setUserData = async () => {
        const data = await loginUser()

        dispatch({
            type: actionTypes.SET_USER,
            user: data
        })
    }

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center px-20 from-red-500 to-blue-500 bg-gradient-to-bl">
            <div className='flex flex-col p-4 justify-center items-center bg-[#2f2f3f] rounded-2xl'>
                <div>
                    <Image
                        src={logo}
                        height={55}
                        width={70}
                        alt="logo"
                    />
                </div>

                <h1 className='text-[#afb3b8] font-semibold text-lg'>
                    Please authenticate to use the application
                </h1>
                <p className='text-[#dfdfdf] font-semibold text-sm'>
                    We will check if wallet exists,
                </p>
                <p className='text-[#dfdfdf] font-semibold text-sm'>
                    if it's true we will LogIn you,
                </p>
                <p className='text-[#dfdfdf] font-semibold text-sm'>
                    if it's false we will create user
                </p>
                <form onSubmit={authenticate} className='flex flex-col items-center'>
                    <div className='my-4'>
                        <div className='text-[#afb3b8] font-semibold mb-2 ml-3'>Name</div>
                        <div className='flex items-center w-[20rem] bg-[#3a3b3d] rounded-full'>
                            <input
                                className='bg-transparent flex-1 m-2 outline-none text-white px-2'
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className='my-4'>
                        <div className='text-[#afb3b8] font-semibold mb-2 ml-3'>Password</div>
                        <div className='flex items-center w-[20rem] bg-[#3a3b3d] rounded-full'>
                            <input
                                className='bg-transparent flex-1 m-2 outline-none text-white px-2'
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className='my-4'>
                        <div className='text-[#afb3b8] font-semibold mb-2 ml-3'>Select Account type</div>
                        <select className='w-full bg-[#3a3b3d] rounded-full text-white p-4' value={type} onChange={e => setType(e.target.value)}>
                            {options.map((option) => (
                                <option value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <WalletMultiButton />

                    <button disabled={!wallet.connected} className={`bg-[#3a3b3d] disabled:bg-[#686a6d] text-white font-semibold m-2 px-4 py-2 hover:px-6 disabled:hover:px-4 rounded-full ${wallet.connected && "cursor-pointer"} duration-[0.2s] ease-in-out`} type="submit">
                        Auth
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Auth