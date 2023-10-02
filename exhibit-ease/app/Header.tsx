"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import logo_no_background from "./images/logo_no_background.png";

function AuthSection() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        {session?.user?.name}
        <button
          className="mt-4 inline-block rounded border border-white px-4 py-2 text-sm leading-none text-white hover:border-transparent hover:bg-white hover:text-teal-500 lg:mt-0"
          onClick={() => signOut()}>Sign Out</button>
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
  const router = useRouter();

  return (
    <nav className="flex flex-wrap items-center justify-between bg-[#551e19] p-6">
      <div className="mr-6 flex flex-shrink-0 items-center text-white">
        <Image src={logo_no_background} width={70} height={70} alt="Exhibit Ease Icon" className="pr-5" />
        <span className="text-xl font-semibold tracking-tight">
          Exhibit Ease
        </span>
      </div>
      {/* This is the hamburger menu */}
      <div className="block lg:hidden">
        <button className="flex items-center rounded border border-teal-400 px-3 py-2 text-teal-200 hover:border-white hover:text-white">
          <svg
            className="h-3 w-3 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="block w-full flex-grow lg:flex lg:w-auto lg:items-center">
        <div className="text-base lg:flex-grow">
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
        <div>
          <AuthSection />
        </div>
      </div>
    </nav>
  );
};

export default Header;
