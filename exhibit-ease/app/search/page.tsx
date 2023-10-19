import { prisma } from '@/lib/prisma';
import Image from "next/image";
import Link from 'next/link';
import React, { useState } from 'react';

export default function Page() {

  return <>
    {/*Search bar */}
    <div className="w-full px-10 mb-10">
      <div className="flex bg-white p-4 rounded-full items-center shadow-xl">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search Museums..."
          className="flex-grow rounded-full px-4 py-2 outline-none"
        />
        {/* Search Button */}
        <button className="bg-blue-500 text-white rounded-full px-4 py-2">Search</button>
      </div>
    </div>
    {/* Left side filters and right side cards */}
    <div className="flex flex-col w-full lg:flex-row">
      <div className="grid flex-grow h-full card bg-base-300 rounded-box place-items-center lg:flex-shrink-0 lg:w-1/5">
        {/* Museum Type Filter */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="my-accordion-3" defaultChecked={true} />
          <div className="collapse-title text-xl font-medium">
            Type
          </div>
          <div className="collapse-content">
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="checkbox" defaultChecked={false} className="checkbox" />
                <span className="label-text">ART</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="checkbox" defaultChecked={false} className="checkbox" />
                <span className="label-text">SCIENCE</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="checkbox" defaultChecked={false} className="checkbox" />
                <span className="label-text">HISTORY</span>
              </label>
            </div>
          </div>
        </div>
        {/* Museum City Filter */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">
            City
          </div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
        {/* Museum State Filter */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">
            State
          </div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
        {/* Museum Price Filter */}
        <div className="collapse collapse-plus bg-base-200">
          <input type="radio" name="my-accordion-3" />
          <div className="collapse-title text-xl font-medium">
            Price
          </div>
          <div className="collapse-content">
            <p>hello</p>
          </div>
        </div>
      </div>
      <div className="divider lg:divider-horizontal"></div>
      <div className="grid flex-grow h-full card bg-base-300 rounded-box place-items-center lg:w-4/5">
        <p>HI</p>

      </div>
    </div>

  </>
}


// {/* Type Filter */}
// <select className="rounded-full px-2 py-2 mx-2">
// <option value="">All Types</option>
// <option value="art">ART</option>
// <option value="history">HISTORY</option>
// <option value="science">SCIENCE</option>
// {/* Add more options for different types */}
// </select>

// {/* State Filter */}
// <select className="rounded-full px-2 py-2 mx-2">
// <option value="">All States</option>
// <option value="DC">DC</option>
// <option value="NY">NY</option>
// <option value="CA">CA</option>
// <option value="TX">TX</option>
// <option value="CO">CO</option>
// <option value="IL">IL</option>
// <option value="MA">MA</option>
// <option value="MN">MN</option>
// {/* Add more options for different states */}
// </select>

// {/* City Filter */}
// <select className="rounded-full px-2 py-2 mx-2">
// <option value="">All Cities</option>
// <option value="Washington">Washington</option>
// <option value="San Marino">San Marino</option>
// <option value="Chicago">Chicago</option>
// <option value="Los Angeles">Los Angeles</option>
// <option value="San Francisco">San Francisco</option>
// <option value="Houston">Houston</option>
// <option value="Denver">Denver</option>
// <option value="Boston">Boston</option>
// <option value="Minneapolis">Minneapolis</option>
// {/* Add more options for different cities */}
// </select>

// {/* Cost Filter */}
// <select className="rounded-full px-2 py-2 mx-2">
// <option value="">All Costs</option>
// <option value="1">$10 - $15</option>
// <option value="2">$16 - $20</option>
// <option value="3">$21 - $25</option>
// <option value="4">$21 - $25</option>
// <option value="5">$26 - $30</option>
// <option value="5">$31 - $35</option>
// <option value="7">$36 - $40</option>
// </select>
