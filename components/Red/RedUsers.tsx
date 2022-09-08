import Image from 'next/image'
import React from 'react'
import * as anchor from "@project-serum/anchor"
import { SOLANA_HOST } from "../../utils/const"
import { getProgramInstance } from '../../utils/get-program'
import { Program } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'

const { BN, web3 } = anchor
const utf8 = anchor.utils.bytes.utf8
const { SystemProgram } = web3

const defaultAccount = {
    systemProgram: SystemProgram.programId,
    tokenProgram: TOKEN_PROGRAM_ID,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
}

const RedUsers = ({ users, name, url }: any) => {

    const wallet = useWallet()
    const connection = new anchor.web3.Connection(SOLANA_HOST)
    const program = getProgramInstance({ connection, wallet })

    const createChat = async (user_name2:any, user_avatar2: any) => {

        console.log("name: "+user_name2+"avatar: "+user_avatar2)
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
            await program.rpc.createChat(name, url, user_name2, user_avatar2, {
                accounts: {
                    state: stateSigner,
                    chat: chatSigner,
                    authority: wallet.publicKey!,
                    ...defaultAccount,
                },
            })

            console.log(await program.account.chatAccount.all())
        }
    }

    return (
        <div>
            {users.map((user: any) => (
                <div>
                    <h1>{user.name}</h1>
                    <Image height={40} width={40} src={user.profileImage} />
                    <button
                    onClick={()=>createChat(user.name, user.profileImage)}
                    className='p-4 bg-slate-400'>chat</button>
                </div>
            ))}
        </div>
    )
}

export default RedUsers