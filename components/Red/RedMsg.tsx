import Image from 'next/image'
import React from 'react'

const RedMsg = ({ msg, isSender, img, type }: any) => {
    return (
        <div>
            {isSender ?
                <div className="flex my-2 flex-row justify-end">
                    <div className="messages text-sm text-white grid grid-flow-row gap-2">
                        <div className="flex items-center flex-row-reverse group">
                            {type === "Image"
                                ? <Image
                                    src={msg}
                                    height={82}
                                    width={82}
                                />
                                : <p className="px-6 py-3 rounded-t-full rounded-l-full bg-[#E23E57] max-w-xs lg:max-w-md">
                                    {msg}
                                </p>
                            }
                        </div>
                    </div>
                </div>
                :
                <div className="flex my-2 flex-row justify-start">
                    <div className="relative flex flex-shrink-0 mr-4">
                        <Image className="shadow-md rounded-full"
                            src={img}
                            alt=""
                            height={43}
                            width={43}
                        />
                    </div>
                    <div className="messages text-sm text-gray-700 grid grid-flow-row gap-2">
                        <div className="flex items-center group">
                            {type === "Image"
                                ? <Image
                                    src={msg}
                                    height={82}
                                    width={82}
                                />
                                : <p className="px-6 py-3 rounded-t-full rounded-r-full bg-gray-100 max-w-xs lg:max-w-md">
                                    {msg}
                                </p>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default RedMsg