"use client";

import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import logo_no_background from "../images/logo_no_background.png";
import Avatar from "boring-avatars";

function AuthSection() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (session) {
    return (
      <>
        <div onClick={toggleDropdown} className="relative inline-block">
          <button className="dropdown transition ease-in-out delay-150 duration-300 border-4 border-white rounded-full hover:border-gray-300 hover:scale-110">
            <Avatar
              size={38}
              name={session?.user?.name || ''}
              variant="beam"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            />
          </button>
        </div>
        {isOpen && (
          <div className="dropdown-menu z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-2">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <a href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
              </li>
              <li>
                <a onClick={() => signOut()} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
              </li>
            </ul>
          </div>
        )}
      </>
    )
  }
  return (
    <>
      <button
        onClick={() => signIn()}
        className="mt-4 inline-block rounded border border-white px-4 py-2 text-sm leading-none text-white hover:border-transparent hover:bg-white hover:text-teal-500 lg:mt-0"
      >
        Sign In
      </button>
    </>
  )
}
const Header: React.FC = () => {
  return <nav>
    <div className="flex bg-[#661900] max-w mx-auto items-center">
      <div className="flex-1 flex justify-left ml-28 mr-auto">
        <Link
          href="\"
          className="mr-4 mt-4 block text-teal-200 hover:text-white lg:mt-0 lg:inline-block"
        >
          Home
        </Link>
        <Link
          href="\about"
          className="mr-4 mt-4 block text-teal-200 hover:text-white lg:mt-0 lg:inline-block"
        >
          About
        </Link>
      </div>
      <div className="mx-12">
        <div className="mr-6 flex flex-shrink-0 items-center text-white py-2">
          <Image src={logo_no_background} width={85} height={85} alt="Exhibit Ease Icon" className="pr-5" />
        </div>
      </div>
      <div className="flex-1 flex justify-end ml-auto mr-36 items-center">
        <div>
          <AuthSection />
        </div>
      </div>
    </div>
  </nav>
}

export default Header;
