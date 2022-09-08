import React from 'react'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')

const BusinessCard = ({ title, email, description, time, username }: any) => {

    const clockToDateString = (timestamp: any) =>
        timeAgo.format(new Date(timestamp.toNumber() * 1000), 'twitter-now')

    return (
        <div className="w-full py-12 lg:flex border border-gray-200">
            <div
                className="lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r  flex flex-col justify-between leading-normal px-8">
                <div className="mb-8">
                    <div className="text-gray-900 font-bold text-xl mb-2">
                        {title}
                    </div>
                    <p className="text-gray-700 text-base pt-5 pb-2">
                        <span className="text-black">Send message in -</span>
                        {email}
                    </p>
                    <p className="text-gray-700 text-base">
                        {description}
                    </p>
                </div>
                <div className="flex items-center">
                    <div className="text-sm">
                        <p className="text-gray-900 leading-none">{username}</p>
                        <p className="text-gray-600">{clockToDateString(time)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BusinessCard