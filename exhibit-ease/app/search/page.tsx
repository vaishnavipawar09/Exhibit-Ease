import { prisma } from '@/lib/prisma';
import Image from "next/image";
import Link from 'next/link';

export default function Page() {
  return <>
    <div className="w-full px-10">
      <div className="flex bg-white p-4 rounded-full items-center shadow-xl">
        <input
          type="text"
          placeholder="Search Museums..."
          className="flex-grow rounded-full px-4 py-2 outline-none"
        />
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>



      </div>
    </div></>;
}