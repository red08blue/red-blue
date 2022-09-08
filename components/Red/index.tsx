import React from 'react'
import Feed from './Feed'
import Header from './Header'

const Red = ({ name, url }: any) => {
  return (
    <div className="min-h-screen w-full bg-[#ffe8e8] from-[#ddd6f3] to-[#faaca8] bg-gradient-to-br">

      <Header
        isHome
        name={name}
        url={url}
        isChat={false}
        isUsers={false}
      />
      <div className='flex-1 flex justify-center'>
        <Feed
          name={name}
          url={url}
        />
      </div>

    </div>
  )
}

export default Red