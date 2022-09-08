import Image from 'next/image'
import React from 'react'
import logo from "../assets/logo.png"

const Footer = () => {
    return (
        <footer className="flex h-24 w-full items-center justify-center border-t">
            <h1 className="flex items-center justify-center gap-2">
                All right reserved at{' '}
                <Image src={logo} alt="Logo" width={60} height={50} />
            </h1>
        </footer>
        /*<div className="h-auto bg-blue-800">
            <div className="lg:flex md:flex pl-3 lg:p-16 md:p-16 lg:mx-auto lg:container lg:text-center">
                <div className="py-4 lg:w-1/4 md:w-1/4">
                    <ul className="text-left lg:pl-20 md:px-5">
                        <li className="text-white"><a href="#">About us</a></li>
                        <li className="text-white"><a href="#">Feedback</a></li>
                        <li className="text-white"><a href="#">Community</a></li>
                    </ul>
                </div>
                <div className="py-4 lg:w-1/4 md:w-1/4">
                    <ul className="text-left md:px-5">
                        <li className="text-white"><a href="#">Trust, Safety & Security</a></li>
                        <li className="text-white"><a href="#">Help & Support</a></li>
                        <li className="text-white"><a href="#">Upwork Foundation</a></li>
                    </ul>
                </div>
                <div className="py-4 lg:w-1/4 md:w-1/4">
                    <ul className="text-left md:px-5">
                        <li className="text-white"><a href="#">Terms of Service</a></li>
                        <li className="text-white"><a href="#">Privacy Policy</a></li>
                        <li className="text-white"><a href="#">Accessibility</a></li>
                    </ul>
                </div>
                <div className="py-4 lg:w-1/4 md:w-1/4">
                    <ul className="text-left md:px-5">
                        <li className="text-white"><a href="#">Desktop App</a></li>
                        <li className="text-white"><a href="#">Cookie Policy</a></li>
                        <li className="text-white"><a href="#">Enterprise Solutions</a></li>
                    </ul>
                </div>
            </div>
            <div
                className="py-3 lg:flex md:flex pl-3 md:pl-0 lg:pl-16 lg:mx-auto md:mx-auto lg:container md:container lg:text-center lg:justify-between md:justify-between">
                <div className="lg:flex md:flex mt-2 lg:m-0 md:m-0">
                    <p className="text-white lg:pl-20 pt-2">Follow us</p>
                    <div className="flex">
                        <div className="h-10 w-10 rounded-full bg-gray-700 mr-1 lg:mx-2 md:mx-2">
                            <i className="fa fa-facebook text-white p-3"></i>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gray-700 mx-1">
                            <i className="fa fa-linkedin text-white p-3"></i>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gray-700 mx-1">
                            <i className="fa fa-twitter text-white p-3"></i>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gray-700 mx-1">
                            <i className="fa fa-youtube text-white p-3"></i>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gray-700 mx-1">
                            <i className="fa fa-instagram text-white p-3"></i>
                        </div>
                    </div>
                </div>
                <div className="lg:flex md:flex mt-2 lg:m-0 md:m-0 lg:pr-40">
                    <p className="text-white md:pl-5 pt-2">Mobile App</p>
                    <div className="flex">
                        <div className="h-10 w-10 rounded-full bg-gray-700 mr-1 lg:mx-2 md:mx-2">
                            <i className="fa fa-android text-white p-3"></i>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gray-700 mx-1">
                            <i className="fa fa-apple text-white p-3"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <p className="text-white py-5 text-center">© 2015 - 2020 Upwork® Global Inc.</p>
            </div>
        </div>*/
    )
}

export default Footer