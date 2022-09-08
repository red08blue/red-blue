import React from 'react'
import Feeds from './Feeds'
import Sidebar from './Sidebar'

const Blue = ({name,url}:any) => {
  return (
    <div className='flex w-full '>
        <Sidebar
        initialSelectedIcon='Home'
        />

        <div className='flex-1 flex justify-center'>
          <Feeds
          name={name}
          url={url}
          />
        </div>

        {/* <RightSidebar /> */}
    </div>
  )
}

export default Blue