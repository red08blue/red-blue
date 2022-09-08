import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import RedMsg from './RedMsg'
import { AiOutlineCloudUpload, AiOutlineFileImage, AiOutlineSend } from 'react-icons/ai'
import * as anchor from "@project-serum/anchor"
import { SOLANA_HOST } from "../../utils/const"
import { getProgramInstance } from '../../utils/get-program'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { client, urlFor } from '../../lib/sanity'

const { BN, web3 } = anchor
const utf8 = anchor.utils.bytes.utf8
const { SystemProgram } = web3

const defaultAccount = {
    systemProgram: SystemProgram.programId,
    tokenProgram: TOKEN_PROGRAM_ID,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
}

const RedChatRoom = (data: any) => {

    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([])

    const [imagesAssets, setImagesAssets]: any = useState(null)
    const [wrongTypeofImage, setWrongTypeofImage] = useState(false)
    const [field, setField] = useState(false)

    const wallet = useWallet()
    const connection = new anchor.web3.Connection(SOLANA_HOST)
    const program = getProgramInstance({ connection, wallet })

    const getMessages = async () => {
        try {
            let [chatSigner] = await anchor.web3.PublicKey.findProgramAddress(
                [utf8.encode('chat'), data.data.index.toArrayLike(Buffer, 'be', 8)],
                program.programId,
            )

            const chat = await program.account.chatAccount.fetch(chatSigner)

            let messageSigners = []

            for (let i = 0; i < chat.messageCount.toNumber(); i++) {
                let [messageSigner] = await anchor.web3.PublicKey.findProgramAddress(
                    [
                        utf8.encode('message'),
                        new BN(data.data.index).toArrayLike(Buffer, 'be', 8),
                        new BN(i).toArrayLike(Buffer, 'be', 8),
                    ],
                    program.programId,
                )

                messageSigners.push(messageSigner)
            }

            const messages: any = await program.account.messageAccount.fetchMultiple(
                messageSigners,
            )

            messages.sort((a: any, b: any) => a.messageTime.toNumber() - b.messageTime.toNumber())

            setMessages(messages)
        } catch (error) {
            alert(error)
        }
    }

    const sendMessage = async (message: string, message_type: string) => {
        let [chatSigner] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('chat'), data.data.index.toArrayLike(Buffer, 'be', 8)],
            program.programId,
        )

        try {
            let [messageSigner] = await anchor.web3.PublicKey.findProgramAddress(
                [
                    utf8.encode('message'),
                    data.data.index.toArrayLike(Buffer, 'be', 8),
                    data.data.messageCount.toArrayLike(Buffer, 'be', 8),
                ],
                program.programId,
            )

            await program.rpc.createMessage(
                //sender name
                data.data.isUser1
                    ? data.data.userName1
                    : data.data.userName2,
                //sender avatar
                data.data.isUser1
                    ? data.data.userAvatar1
                    : data.data.userAvatar2,
                message, message_type, {
                accounts: {
                    chat: chatSigner,
                    message: messageSigner,
                    authority: wallet.publicKey!,
                    ...defaultAccount,
                },
            })

            console.log(await program.account.messageAccount.fetch(messageSigner))
        } catch (error) {
            console.error(error)
        }
    }

    const sendText = (e: any) => {
        e.preventDefault()

        sendMessage(input, "Text")

        setInput("")
    }

    const uploadImage = async (e: any) => {
        const selectedImage = e.target.files[0]

        //to input an image to the upload field
        if (selectedImage.type === 'image/png' ||
            selectedImage.type === 'image/svg' ||
            selectedImage.type === 'image/jpeg' ||
            selectedImage.type === 'image/gif' ||
            selectedImage.type === 'image/tiff') {
            setWrongTypeofImage(false)

            await client.assets
                .upload('image', selectedImage, { contentType: selectedImage.type, filename: selectedImage.name })
                .then((document: any) => {
                    setImagesAssets(document)

                })
                .catch((error) => {
                    console.log('Upload failed:', error.message)
                })
        } else {
            setWrongTypeofImage(true)
        }

        if (imagesAssets?._id) {
            const doc = {
                _type: "photo",
                image: {
                    _type: "image",
                    asset: {
                        _type: "reference",
                        _ref: imagesAssets?._id,
                    },
                },
            }
            await client.create(doc).then((d) => {
                sendMessage(urlFor(d.image).url(), "Image")
                setImagesAssets(null)
            })
        } else {
            setField(true)

            setTimeout(() => {
                setField(false)
            }, 2000)
        }
    }

    useEffect(() => {
        setInterval(() => {
            getMessages()
        }, 3000)
    }, [])



    return (
        <section className="flex flex-col flex-auto border-l">
            <div className="px-6 py-4 flex flex-row flex-none justify-between items-center shadow">
                <div className="flex">
                    <div className="mr-4 relative flex flex-shrink-0">
                        <Image className="shadow-md rounded-full object-cover"
                            src={data.data.isUser1 ? data.data.userAvatar2 : data.data.userAvatar1}
                            alt=""
                            height={43}
                            width={43}
                        />
                    </div>
                    <div className="text-sm">
                        <p className="font-bold">
                            {data.data.isUser1 ? data.data.userName2 : data.data.userName1}
                        </p>
                    </div>
                </div>
            </div>

            <div className="chat-body p-4 flex-1 overflow-y-scroll">

                {messages.map((message: any) =>
                    <RedMsg
                        msg={message.content}
                        img={message.senderAvatar}
                        isSender={data.data.isUser1
                            ? data.data.userName1 === message.senderName
                            : data.data.userName2 === message.senderName}
                        type={message.messageType}
                    />
                )}

            </div>
            <div className="chat-footer flex-none">
                <div className="flex flex-row items-center p-4">
                    <label className="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6">
                        <AiOutlineFileImage className="w-full h-full fill-current cursor-pointer" />
                        <input
                            type="file"
                            name="upload-image"
                            onChange={e => uploadImage(e)}
                            className="hidden"
                        />
                    </label>
                    <form onSubmit={sendText} className='flex items-center relative flex-grow'>
                        <div className="relative flex-grow">
                            <label>
                                <input
                                    className="rounded-full mr-3 py-2 pl-3 pr-10 w-full border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none text-gray-600 focus:shadow-md transition duration-300 ease-in"
                                    type="text"
                                    onChange={e => setInput(e.target.value)}
                                    value={input}
                                    placeholder="...." />
                            </label>
                        </div>
                        <button type="submit" className="flex flex-shrink-0 focus:outline-none mx-2text-blue-600 hover:text-blue-700 w-6 h-6">
                            <AiOutlineSend className="w-full h-full fill-current" />
                        </button>
                    </form >
                </div >
            </div >
        </section >
    )
}

export default RedChatRoom