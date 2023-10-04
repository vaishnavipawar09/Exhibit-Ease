"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import logo_no_background from "../images/logo_no_background.png";

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
  return <nav>
    <div className="flex bg-[#661900] max-w mx-auto items-center">
      <div className="flex-1 flex justify-left ml-10 mr-auto">
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
      <div className="flex-1 flex justify-end ml-auto mr-10">
        <div>
          <AuthSection />
        </div>
      </div>
    </div>
  </nav>
}

export default Header;
