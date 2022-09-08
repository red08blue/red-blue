import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { useWallet } from '@solana/wallet-adapter-react'
import CreatePost from './CreatePost'
import Post from './Post'
import * as anchor from "@project-serum/anchor"
import { SOLANA_HOST } from "../../utils/const"
import { getProgramInstance } from '../../utils/get-program'
import { Program } from '@project-serum/anchor'
import "bn.js"

const { BN, web3 } = anchor
const utf8 = anchor.utils.bytes.utf8
const { SystemProgram } = web3

const defaultAccount = {
  systemProgram: SystemProgram.programId,
  tokenProgram: TOKEN_PROGRAM_ID,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
}


const Feed = ({ name, url }: any) => {

  const [posts, setPosts]: any = useState([])
  const [loading, setLoading] = useState(true)

  const wallet = useWallet()
  const connection = new anchor.web3.Connection(SOLANA_HOST)
  const program = getProgramInstance({ connection, wallet })

  const getAllPosts = async () => {
    try {
      const postsData = await program.account.postAccount.all()

      postsData.sort(
        (a, b) => b.account.postTime.toNumber() - a.account.postTime.toNumber()
      )

      setPosts(postsData)
    } catch (error) {
      console.error(error)
    }
  }

  const savePost = async (text: string, imageUrl: string) => {
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

    let [postSigner] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode('post'), stateInfo.postCount.toArrayLike(Buffer, 'be', 8)],
      program.programId,
    )

    try {
      await program.account.postAccount.fetch(postSigner)
    } catch {
      await program.rpc.createPost(text, imageUrl, name, url, {
        accounts: {
          state: stateSigner,
          post: postSigner,
          authority: wallet.publicKey!,
          ...defaultAccount,
        },
      })

      setPosts(await program.account.postAccount.all())
    }
  }

  useEffect(() => {
   // setInterval(() => {
      getAllPosts()
      setLoading(false)
   // }, 3000)
  }, [])

  return (
    <div className="flex-1 max-w-2xl mx-4">
      <Toaster position='bottom-left' reverseOrder={false} />
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <CreatePost
              savePost={savePost}
              name={name}
              url={url}
            />

            {posts.map((post: { account: any }) => (
              <Post
                post={post.account}
                key={post.account.index}
                name={name}
                url={url}
              />

            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Feed