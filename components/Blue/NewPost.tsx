import { useState, useContext } from 'react'
import { BsCardImage, BsEmojiSmile } from 'react-icons/bs'
import { RiFileGifLine, RiBarChartHorizontalFill } from 'react-icons/ri'
import { IoMdCalendar } from 'react-icons/io'
import { MdOutlineLocationOn } from 'react-icons/md'
import { client, urlFor } from '../../lib/sanity'

const style = {
  wrapper: `px-4 flex flex-row border-b border-[#00000038] pb-4`,
  tweetBoxLeft: `mr-4`,
  tweetBoxRight: `flex-1`,
  profileImage: `height-12 w-12 rounded-full`,
  inputField: `w-full h-full outline-none bg-transparent text-lg`,
  formLowerContainer: `flex`,
  iconsContainer: `text-[#1d9bf0] flex flex-1 items-center`,
  icon: `mr-2`,
  submitGeneral: `px-6 py-2 rounded-3xl font-bold`,
  inactiveSubmit: `bg-[#196195] text-[#95999e]`,
  activeSubmit: `bg-[#1d9bf0] text-white`,
}

function NewPost({ savePost }: any) {

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
    <div className={style.wrapper}>
      <div className={style.tweetBoxLeft}>
        {/*<img
          src={currentUser.profileImage}
          className={
            currentUser.isProfileImageNft
              ? `${style.profileImage} smallHex`
              : style.profileImage
          }
        />*/}
      </div>
      <div className={style.tweetBoxRight}>
        <form onSubmit={handleSubmit}>
          <textarea
            onChange={e => setInput(e.target.value)}
            value={input}
            placeholder="What's happening?"
            className={style.inputField}
          />
          <div className={style.formLowerContainer}>
            <label className={style.iconsContainer}>
              <BsCardImage className={style.icon} />
              <input
                type="file"
                name="post-image"
                onChange={uploadImage}
                className="hidden"
              />
            </label>
            <button
              type='submit'
              disabled={!input}
              className={`${style.submitGeneral} ${input ? style.activeSubmit : style.inactiveSubmit
                }`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewPost