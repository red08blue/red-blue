import { BsFillPatchCheckFill } from 'react-icons/bs'
import { FaRegComment, FaRetweet } from 'react-icons/fa'
import { AiOutlineHeart } from 'react-icons/ai'
import { FiShare } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import * as anchor from "@project-serum/anchor"
import { SOLANA_HOST } from "../../utils/const"
import { getProgramInstance } from '../../utils/get-program'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import Image from 'next/image'

const { BN, web3 } = anchor
const utf8 = anchor.utils.bytes.utf8
const { SystemProgram } = web3

TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')

const defaultAccount = {
  systemProgram: SystemProgram.programId,
  tokenProgram: TOKEN_PROGRAM_ID,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
}

const style = {
  wrapper: `flex p-3 border-b border-[#00000038]`,
  profileImage: `rounded-full h-[40px] w-[40px] object-cover`,
  postMain: `flex-1 px-4`,
  headerDetails: `flex items-center`,
  name: `font-bold mr-1`,
  verified: `text-[0.8rem]`,
  handleAndTimeAgo: `text-[#8899a6] ml-1`,
  tweet: `flex flex-col my-2`,
  image: `rounded-3xl`,
  footer: `flex justify-between mr-28 mt-4 text-[#8899a6]`,
  footerIcon: `rounded-full text-lg px-4 py-2`,
}

interface PostProps {
  username: string,
  url: string,
  post: any,
}

const PostItem = ({
  username,
  url,
  post,
}: PostProps) => {

  const [likesData, setLikesData] = useState([])
  const [isLike, setIsLike] = useState(false)

  const wallet = useWallet()
  const connection = new anchor.web3.Connection(SOLANA_HOST)
  const program = getProgramInstance({ connection, wallet })

  const clockToDateString = (timestamp: any) =>
    timeAgo.format(new Date(timestamp.toNumber() * 1000), 'twitter-now')

  const getLikesOnPost = async () => {
    try {
      let [postSigner] = await anchor.web3.PublicKey.findProgramAddress(
        [utf8.encode('post'), post.index.toArrayLike(Buffer, 'be', 8)],
        program.programId,
      )

      const postT = await program.account.postAccount.fetch(postSigner)

      let likeSigners = []

      for (let i = 0; i < postT.likeCount.toNumber(); i++) {
        let [likeSigner] = await anchor.web3.PublicKey.findProgramAddress(
          [
            utf8.encode('like'),
            new BN(post.index).toArrayLike(Buffer, 'be', 8),
            new BN(i).toArrayLike(Buffer, 'be', 8),
          ],
          program.programId,
        )

        likeSigners.push(likeSigner)
      }

      const likes: any = await program.account.likeAccount.fetchMultiple(
        likeSigners,
      )

      //likes.sort(({ a, b }: any) => a.postTime.toNumber() - b.postTime.toNumber())

      setLikesData(likes)
    } catch (error) {
      console.error(error)
    }
  }

  const saveLike = async () => {

    if (!isLike) {
      let [postSigner] = await anchor.web3.PublicKey.findProgramAddress(
        [utf8.encode('post'), post.index.toArrayLike(Buffer, 'be', 8)],
        program.programId,
      )

      try {
        let [likeSigner] = await anchor.web3.PublicKey.findProgramAddress(
          [
            utf8.encode('like'),
            post.index.toArrayLike(Buffer, 'be', 8),
            post.likeCount.toArrayLike(Buffer, 'be', 8),
          ],
          program.programId,
        )

        await program.rpc.createLike(
          "Like", name, url, {
          accounts: {
            post: postSigner,
            like: likeSigner,
            authority: wallet.publicKey!,
            ...defaultAccount,
          },
        })

        await program.account.likeAccount.fetch(likeSigner)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const checkUserLike = async () => {
    likesData.map((like: any) => {
      if (like.likeerName === username) {
        setIsLike(true)
      }
    })
  }

  useEffect(() => {
    setInterval(() => {
      getLikesOnPost()
    }, 3000)
  }, [])

  useEffect(() => {
    checkUserLike()
  }, [likesData])

  return (
    <div className={style.wrapper}>
      <div>
        <Image
          src={post.posterUrl}
          alt={username}
          className={
            `${style.profileImage} `
          }
          height={40}
          width={40}
        />
      </div>
      <div className={style.postMain}>
        <div>
          <span className={style.headerDetails}>
            <span className={style.name}>{post.posterName}</span>

            <span className={style.handleAndTimeAgo}>
              • {clockToDateString(post.postTime)}
            </span>
          </span>
          <div className={style.tweet}>
            {post.text}
            {post.image.length > 0 &&
              <Image
                src={post.image}
                className="flex-1"
                height={350}
                width={150}
                alt='post image'
              />
            }
          </div>
        </div>
        <div className={style.footer}>
          <div
            onClick={saveLike}
            className={`${style.footerIcon} ${isLike ? "text-[#f91c80]" : "cursor-pointer"} hover:text-[#f91c80] hover:bg-[#39243c]`}
          >
            {likesData.length} <AiOutlineHeart />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostItem