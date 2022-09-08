import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import BlueUsers from '../components/Blue/BlueUsers'
import Sidebar from '../components/Blue/Sidebar'
import Footer from '../components/Footer'
import Header from '../components/Red/Header'
import RedUsers from '../components/Red/RedUsers'
import { useStateValue } from '../context/StateProvider'
import * as anchor from "@project-serum/anchor"
import { SOLANA_HOST } from "../utils/const"
import { getProgramInstance } from "../utils/get-program"
import { Program } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'

const { BN, web3 } = anchor
const utf8 = anchor.utils.bytes.utf8
const { SystemProgram } = web3

const defaultAccount = {
    systemProgram: SystemProgram.programId,
    tokenProgram: TOKEN_PROGRAM_ID,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
}

const users: NextPage = () => {

    const [isBlue, setIsBlue] = useState(false)
    const [users, setUsers] = useState([])

    const [{ user }, dispatch] = useStateValue()

    const wallet = useWallet()
    const connection = new anchor.web3.Connection(SOLANA_HOST)
    const program = getProgramInstance({ connection, wallet })

    const router = useRouter()

    const createChat = async (user_name2: any, user_avatar2: any) => {

        let [stateSigner] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('state')],
            program.programId,
        )

        let stateInfo

        try {
            stateInfo = await program.account.stateAccount.fetch(stateSigner)
        } catch (error) {

            try {
                await program.rpc.createState({
                    accounts: {
                        state: stateSigner,
                        authority: wallet.publicKey!,
                        ...defaultAccount,
                    },
                })

                return
            } catch (error) {
                alert(error)
                return
            }
        }

        let [chatSigner] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('chat'), stateInfo.chatCount.toArrayLike(Buffer, 'be', 8)],
            program.programId,
        )

        try {
            await program.account.chatAccount.fetch(chatSigner)
        } catch {
            await program.rpc.createChat(user[0].name, user[0].profileImage, user_name2, user_avatar2, {
                accounts: {
                    state: stateSigner,
                    chat: chatSigner,
                    authority: wallet.publicKey!,
                    ...defaultAccount,
                },
            })

            //console.log(await program.account.chatAccount.all())

            router.push("/chat")
        }
    }

    useEffect(() => {
        ; (async () => {
            await requestUsersData()
        })()
    }, [])

    const requestUsersData = async () => {
        try {
            const response = await fetch(`/api/fetchUsers`)
            const data = await response.json()

            setUsers(data.data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="overflow-hidden">
            <Head>
                <title>Red-Blue Users</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {user.length > 0 && <main className={`flex ${user[0].type === "Red" && "flex-col"} min-h-screen w-full flex-1 text-center`}>

                {user[0].type === "Blue"
                    ? <Sidebar initialSelectedIcon='Users' />
                    : <Header
                        name={user[0].name}
                        url={user[0].profileImage}
                        isHome={false}
                        isChat={false}
                        isUsers
                    />
                }

                <div className='items-center flex-[0.7] m-3'>
                    {users.map((user: any) => (
                        <div className='flex items-center justify-between p-2 w-1/2 rounded-lg bg-slate-500'>
                            <div>
                                <h1 className='text-lg'>{user.name}</h1>
                                <Image height={40} width={40} src={user.profileImage} />
                            </div>
                            <button
                                onClick={() => createChat(user.name, user.profileImage)}
                                className='py-3 px-5 bg-slate-400 hover:bg-slate-600 rounded-2xl'>chat</button>
                        </div>
                    ))}
                </div>

            </main>}

            <Footer />
        </div>
    )
}

export default users