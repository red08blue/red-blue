import React, { useEffect, useState } from 'react'
import BlueChatItem from './BlueChatItem'
import BlueChatRoom from './BlueChatRoom'
import Sidebar from './Sidebar'
import * as anchor from "@project-serum/anchor"
import { SOLANA_HOST } from "../../utils/const"
import { getProgramInstance } from '../../utils/get-program'
import { useWallet } from '@solana/wallet-adapter-react'
import { BN } from 'bn.js'

const BlueChat = ({ name, url }: any) => {

    const [selected, setSelected] = useState(false)
    const [selectedData, setSelectedData] = useState({
        userName1: "",
        userAvatar1: "",
        userName2: "",
        userAvatar2: "",
        index: BN,
        isUser1: false,
        messageCount: BN,
    })
    const [userChats, setUserChats]: any = useState([])

    const wallet = useWallet()
    const connection = new anchor.web3.Connection(SOLANA_HOST)
    const program = getProgramInstance({ connection, wallet })

    const getUserChats = async () => {
        try {
            const chats = await program.account.chatAccount.all()

            chats.map((chat: any) => {
                if (chat.account.userName1 === name) {
                    if (userChats.length > 0) {
                        setUserChats([...userChats, chat])
                    } else {
                        setUserChats([chat])
                    }
                } else {
                    if (chat.account.userName2 === name) {
                        if (userChats.length > 0) {
                            setUserChats([...userChats, chat])
                        } else {
                            setUserChats([chat])
                        }
                    }
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

    const selectChat = (data: any) => {

        setSelectedData({
            userName1: data.userName1,
            userAvatar1: data.userAvatar1,
            userName2: data.userName2,
            userAvatar2: data.userAvatar2,
            index: data.index,
            isUser1: data.userName1 === name,
            messageCount: data.messageCount
        })

        setSelected(true)
    }

    useEffect(() => {
        getUserChats()
    }, [])

    return (
        <div className='flex w-full '>
            <Sidebar initialSelectedIcon='Chat' />
            <div className="h-screen w-full flex antialiased overflow-hidden">
                <div className="flex-1 flex flex-col">
                    <main className="flex-grow flex flex-row min-h-0">
                        {selected ?
                            <BlueChatRoom
                                data={selectedData}
                            />
                            : <div className='flex w-full text-xl text-center items-center justify-center'>
                                Nothing to show
                                {selectedData.userName1}
                            </div>
                        }

                        <section className="flex flex-col flex-none overflow-auto w-24 lg:max-w-sm md:w-2/5 transition-all duration-300 ease-in-out">
                            <div className="contacts p-2 flex-1 overflow-y-scroll">
                                {userChats.map((chat: any) =>
                                    <div onClick={() => selectChat(chat.account)}>
                                        <BlueChatItem
                                            name={
                                                chat.account.userName1 === name
                                                    ? chat.account.userName2
                                                    : chat.account.userName1
                                            }
                                            img={
                                                chat.account.userName1 === name
                                                    ? chat.account.userAvatar2
                                                    : chat.account.userAvatar1
                                            }
                                            isSelected={
                                                selected ?? chat.account.index === selectedData.index
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </section>

                    </main>
                </div>
            </div>
        </div>
    )
}

export default BlueChat