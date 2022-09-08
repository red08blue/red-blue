import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { BsFileImageFill, BsFillCameraVideoFill } from 'react-icons/bs'
import { FiSend } from 'react-icons/fi'
import 'react-simple-hook-modal/dist/styles.css'
import { client, urlFor } from '../../lib/sanity'

const CreatePost = ({ savePost, name, url }: any) => {

    const [input, setInput] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    const [imagesAssets, setImagesAssets]: any = useState(null)
    const [wrongTypeofImage, setWrongTypeofImage] = useState(false)
    const [field, setField] = useState(false)

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        await savePost(input, imageUrl)

        setInput('')
        setImageUrl('')
        setImagesAssets(null)
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
                setImageUrl(urlFor(d.image).url())
            })
        } else {
            setField(true)

            setTimeout(() => {
                setField(false)
            }, 2000)
        }
    }


    return (
        <div className="w-full flex mt-[1rem] flex-col rounded-[0.6rem] bg-[#F6F6F6] p-2 pt-4 pb-0 shadow-[0px 5px 7px -7px rgba(0, 0, 0, 0.75)]">
            <form onSubmit={handleSubmit} className="flex flex-col pb-3 mb-2 border-[#404041] items-center">
                <div className='flex-1 flex items-center w-full'>
                    <Image
                        src={url}
                        alt='profile image'
                        className="rounded-full object-cover"
                        height={40}
                        width={40}
                    />
                    <input
                        value={input}
                        onChange={event => setInput(event.target.value)}
                        className="flex-1 py-10 px-4 mx-6 rounded-xl bg-[#f5e6e6] outline-none border-none text-[#311D3F]"
                        placeholder={`Write what do you want, ${name}`}
                    />

                </div>
                <div className="flex justify-evenly m-2">
                    <label>
                        <div className="flex flex-1 items-center justify-center p-1 mx-2 text-[#E23E57] cursor-pointer hover:bg-[#d6cece] rounded-[0.5rem] transition-all duration-300 ease-in-out">
                            <BsFileImageFill className="text-green-500" />
                            <div className="font-semibold ml-3 text-lg text-[#afb3b8]">Photo</div>
                        </div>
                        <input
                            type="file"
                            name="post-image"
                            onChange={uploadImage}
                            className="hidden"
                        />
                    </label>
                    <button type='submit'
                        className="flex flex-1 items-center justify-center p-1 mx-2 text-[#E23E57] cursor-pointer hover:bg-[#d6cece] rounded-[0.5rem] transition-all duration-300 ease-in-out">
                        <FiSend className="text-blue-500" />
                        <div className="font-semibold ml-3 text-lg text-[#afb3b8]">Create Posts</div>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreatePost