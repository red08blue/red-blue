import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { BiLike } from 'react-icons/bi'
import { FaRegCommentAlt } from 'react-icons/fa'
import { FiRefreshCw } from 'react-icons/fi'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import * as anchor from "@project-serum/anchor"
import { SOLANA_HOST } from "../../utils/const"
import { getProgramInstance } from '../../utils/get-program'
import { Program } from '@project-serum/anchor'
import "bn.js"
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'

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

const Post = ({ post, name, url }: any) => {

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
      if (like.likeerName === name) {
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
    <div className="w-full my-3 rounded-[0.6rem] bg-[#F6F6F6] text-[#311D3F] p-[0.4rem] pb-0">
      <div className="flex position-relative items-center">
        <Image
          src={post.posterUrl}
          className="rounded-full"
          height={44}
          width={44}
          alt='publisher profile image'
        />
        <div className="flex flex-col ml-[0.5rem]">
          <div className="text-sm">{post.posterName}</div>
          <div className="text-sm text-[#777]">
            {clockToDateString(post.postTime)}
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col py-[1rem] px-[1.2rem]">
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

      <div onClick={saveLike}
        className={`text-[18px] flex justify-evenly text-[#b0b3b8] ${isLike ? "text-[#f91c80]" : "cursor-pointer"} py-1`}>
        <div className="flex flex-1 items-center justify-center rounded-[0.4rem] hover:bg-[#d6cece] py-2">
          <h1 className="mr-1">{likesData.length}</h1>
          <BiLike />
          <div className="ml-[1rem]">Like</div>
        </div>
      </div>
    </div>
  )
}

export default Post