'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RiHome2Fill } from "react-icons/ri";
import { IoChatbubbles } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { useState } from 'react';

const Navbar = () => {
    const navItems = [
        { name: 'Home', url: '/' },
        { name: 'Chat', url: '/chat' },
        { name: 'Profile', url: '/profile' }
    ]

    const navIcons = [
        { name: 'Home', url: '/', icon: RiHome2Fill },
        { name: 'Chat', url: '/chat', icon: IoChatbubbles },
        { name: 'Profile', url: '/profile', icon: FaCircleUser }
    ]

    const pathName = usePathname()
    const [token, setToken] = useState(false)

    return (
        <div className="bg-red-50 w-full h-20 flex justify-between lg:px-10 items-center fixed top-0">
            {/* logo */}
            <div className="w-40 flex items-center h-full">
                <Link href={'/'}>
                    <Image
                        src='/chat-logo.png'
                        width={280}
                        height={120}
                        alt="chat-logo"
                    />
                </Link>
            </div>

            {/* desktop nav menu */}
            <nav className='lg:flex items-center gap-20 px-10 hidden'>
                {
                    navItems.map((navItem, index) => {
                        // ✅ Profile/Sign In logic for desktop
                        const displayName =
                            navItem.name === 'Profile'
                                ? (token ? 'Profile' : 'Sign In')
                                : navItem.name

                        const linkUrl =
                            navItem.name === 'Profile'
                                ? (token ? '/profile' : '/auth')
                                : navItem.url

                        return (
                            <Link
                                href={linkUrl}
                                key={index}
                                className={`${pathName === navItem.url ? 'font-semibold' : ''}`}
                            >
                                {displayName}
                            </Link>
                        )
                    })
                }
            </nav>

            {/* mobile nav menu */}
            <div className='lg:hidden px-4'>
                <div className='w-12 h-12 rounded-full border'></div>
            </div>

            {/* mobile navIcons */}
            <nav className='bg-red-50 fixed bottom-0 flex justify-evenly w-full p-3 gap-10 lg:hidden'>
                {
                    navIcons.map((navIcon, index) => {
                        // ✅ Profile/Sign In logic for mobile
                        const displayName =
                            navIcon.name === 'Profile'
                                ? (token ? 'Profile' : 'Sign In')
                                : navIcon.name

                        const linkUrl =
                            navIcon.name === 'Profile'
                                ? (token ? '/profile' : '/auth')
                                : navIcon.url

                        return (
                            <Link
                                href={linkUrl}
                                key={index}
                                className={`grid place-items-center gap-2 ${pathName === navIcon.url ? 'text-red-500' : ''}`}
                            >
                                {<navIcon.icon />}
                                <p className='text-xs font-semibold'>{displayName}</p>
                            </Link>
                        )
                    })
                }
            </nav>
        </div>
    )
}

export default Navbar
