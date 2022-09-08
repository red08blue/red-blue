import Image from 'next/image'
import React from 'react'

interface ItemProps {
    name: string,
    img: string,
    isSelected: boolean
}

const BlueChatItem = ({ name, img, isSelected }: ItemProps) => {
    return (
                <div className={`flex m-2 justify-between items-center p-3 ${isSelected && "bg-gray-200"} hover:bg-gray-100 rounded-lg relative`}>
                    <div className="relative flex flex-shrink-0">
                        <Image className="shadow-md rounded-full w-full h-full object-cover"
                            src={img}
                            alt=""
                            height={43}
                            width={43}
                        />
                    </div>
                    <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block">
                        <p className="font-bold">{name}</p>
                        <div className={`flex items-center text-sm font-bold ${isSelected && "text-gray-600"}`}>
                            <div className="min-w-0">
                                <p className="truncate">{"lastMsg"}</p>
                            </div>
                            <p className="ml-2 whitespace-no-wrap">{"lastActive"}</p>
                        </div>
                    </div>
                </div>

    )
}

export default BlueChatItem