import { useState, useEffect } from 'react'
import NewPost from './NewPost'
import PostItem from './PostItem'
import { BsStars } from 'react-icons/bs'
import * as anchor from "@project-serum/anchor"
import { SOLANA_HOST } from "../../utils/const"
import { getProgramInstance } from '../../utils/get-program'
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

function Feeds({ name, url }: any) {

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
    getAllPosts()
    setLoading(false)
  }, [])

  return (
    <div className="flex-[2] overflow-y-scroll no-scrollbar">
      <div className="sticky top-0 z-10 p-4 flex justify-between items-center">
        <div className="text-xl font-bold"></div>
        <BsStars />
      </div>
      {loading ? <div>Loading...</div>
        : (
          <div>
            <NewPost
              savePost={savePost}
            />
            {posts.map((post: any) =>
              <PostItem
                username={name}
                url={url}
                post={post.account}
              />
            )}
          </div>
        )}

    </div>
  )
}

export default Feeds