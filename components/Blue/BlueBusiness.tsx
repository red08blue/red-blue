import React, { useState, useEffect } from 'react'
import BusinessCard from './BusinessCard'
import Sidebar from './Sidebar'
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

const BlueBusiness = ({ name, url }: any) => {

  const [title, setTitle] = useState("")
  const [email, setEmail] = useState("")
  const [description, setDescription] = useState("")

  const [search, setSearch] = useState("")

  const [jobs, setJobs]: any = useState([])
  const [sJobs, setSJobs]: any = useState([])

  const wallet = useWallet()
  const connection = new anchor.web3.Connection(SOLANA_HOST)
  const program = getProgramInstance({ connection, wallet })

  const getAllJobs = async () => {
    try {
      const jobsData = await program.account.businessAccount.all()

      jobsData.sort(
        (a, b) => b.account.businessTime.toNumber() - a.account.businessTime.toNumber()
      )

      setJobs(jobsData)
    } catch (error) {
      console.error(error)
    }
  }

  const saveJob = async () => {

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

    let [businessSigner] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode('business'), stateInfo.businessCount.toArrayLike(Buffer, 'be', 8)],
      program.programId,
    )

    try {
      await program.account.businessAccount.fetch(businessSigner)
    } catch {
      await program.rpc.createBusiness(name, url, title, email, description, {
        accounts: {
          state: stateSigner,
          business: businessSigner,
          authority: wallet.publicKey!,
          ...defaultAccount,
        },
      })

      setJobs(await program.account.businessAccount.all())
    }
  }

  useEffect(() => {
    getAllJobs()
  }, [])

  useEffect(() => {
    setSJobs(jobs.filter((job: any) => job.account.title.includes(search)))
  }, [search, jobs])

  const submit = async (event: any) => {

    event.preventDefault()

    await saveJob()

    setTitle("")
    setEmail("")
    setDescription("")
  }

  return (
    <div className='w-full'>
      <div className="w-full flex">
        <Sidebar initialSelectedIcon='Business' />
        <div className="container mx-auto">
          <div className="pt-8">
            <div className="rounded bg-white shadow-lg lg:mx-24">
              <div className="bg-gray-200 pl-8 py-12 border-solid border-gray-300 border-2">

                <div className='w-3/4 my-4 p-5 bg-[#a9bcb757]'>
                  <form onSubmit={submit} className='flex flex-col items-center text-lg font-extralight'>

                    <h1 className='text-2xl font-semibold'>Add new job</h1>
                    <div className='block justify-center items-center m-5'>
                      <input
                        className='px-6 py-2 m-2 rounded-xl'
                        placeholder='The title of job'
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                      />
                      <input
                        className='px-6 py-2 m-2 rounded-xl'
                        placeholder='The e-mail of job'
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <textarea
                      className='w-full'
                      placeholder='Job description'
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      required />
                    <button type='submit'
                      className='m-2 py-2 px-4 hover:px-6 rounded-md bg-red-500 hover:bg-red-600 text-white'>
                      Add
                    </button>
                  </form>
                </div>

                <div className="flex">
                  <div className="w-3/4">
                    <form className="flex flex-row border border-gray-100 rounded w-full">
                      <input className="pl-3 h-10 appearance-none block w-full text-gray-700 leading-tight focus:outline"
                        type="text" placeholder="Search for jobs"
                        onChange={e => setSearch(e.target.value)}
                      />
                      <button className="bg-green-600 w-10"><i className="fa fa-search text-white"></i></button>
                    </form>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="pt-3">
                    <i className="fa fa-rss text-green-600"></i><span className="text-black ml-3">{sJobs.length}</span><span
                      className="text-gray-700"> Jobs found</span>
                  </div>
                </div>
              </div>

              {jobs.map((job: any) =>
                <BusinessCard
                  title={job.account.title}
                  email={job.account.email}
                  description={job.account.description}
                  username={job.account.userName}
                  time={job.account.businessTime}
                />
              )}

            </div>
          </div>
        </div>
        <div className="py-10"></div>
      </div>
    </div>
  )
}

export default BlueBusiness