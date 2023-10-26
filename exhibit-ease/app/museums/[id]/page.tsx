'use client';

import { useMuseums } from '@/app/contexts/MuseumContext';
import { prisma } from '@/lib/prisma';
import Image from "next/image";
import Link from 'next/link';


export default function Page({ params }: {
  params: { id: string }
}) {
  const { getMuseumsByField } = useMuseums();
  var museum = getMuseumsByField('id', parseInt(params.id))[0];

  const googleMapsLink: string = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(museum?.address || '') + '+' + encodeURIComponent(museum?.city || '') + '+' + encodeURIComponent(museum?.state || '')
  return <main className="h-screen">
    {museum ? (
      <>
        <div className="hero h-3/4"
          style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, .6), rgba(255, 255, 255, .6)), url('${museum?.bg_image}')` }}>

          <div className="hero-content flex-col lg:flex-row">
            {museum && (
              <Image
                src={museum.main_image || ""}
                alt={museum.name}
                width={350}
                height={350}
                className="w-[350px] h-[350px] rounded-xl border-black border-[3px] max-w-sm shadow-2xl"
              />
            )}
            <div className='mx-auto text-center'>
              <h1 className="text-6xl font-bold mb-4 text-center">{museum?.name}</h1>
              <div className="flex flex-col items-center">
                <Link href={googleMapsLink}
                  rel="noopener noreferrer" target="_blank"
                  className="text-4xl font-semibold mb-4 text-center">
                  {museum?.address}, {museum?.city}, {museum?.state}
                </Link>
                <a href={`/booking?id=${museum?.id}`} className="btn btn-primary">Book Tickets</a>
              </div>
            </div>


          </div>
        </div>

        {/* About section */}
        <div className="container mx-auto px-5 md:px-20 py-10">
          <p className="text-lg font-bold mb-4">About the Museum:</p>
          {museum && (
            <div className="mb-10">
              {museum?.description?.split('\\n').map((line, index) => (
                <p key={index} className="text-xl mb-4">
                  {line}
                </p>
              ))}
            </div>
          )}

          <hr className="h-px my-8 border-0 bg-black" />

          <div className="carousel w-full max-h-[35rem] bg-black">

            <div id="slide1" className="carousel-item flex items-center justify-center relative w-full">
              <img src={museum?.bg_image || ''} className="w-auto h-[500px] object-cover mx-auto" />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide4" className="btn btn-circle">❮</a>
                <a href="#slide2" className="btn btn-circle">❯</a>
              </div>
            </div>

            <div id="slide2" className="carousel-item flex items-center justify-center relative w-full">
              <img src={museum?.main_image || ''} className="w-auto h-[500px] object-cover mx-auto" />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide1" className="btn btn-circle">❮</a>
                <a href="#slide3" className="btn btn-circle">❯</a>
              </div>
            </div>

            <div id="slide3" className="carousel-item flex items-center justify-center relative w-full">
              <img src={museum?.bg_image || ''} className="w-auto h-[500px] object-cover mx-auto" />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide2" className="btn btn-circle">❮</a>
                <a href="#slide4" className="btn btn-circle">❯</a>
              </div>
            </div>

            <div id="slide4" className="carousel-item flex items-center justify-center relative w-full">
              <img src={museum?.bg_image || ''} className="w-auto h-[500px] object-cover mx-auto" />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide3" className="btn btn-circle">❮</a>
                <a href="#slide1" className="btn btn-circle">❯</a>
              </div>
            </div>

          </div>



        </div>
      </>
    ) : <div className="flex justify-center items-center h-full">
      Loading...
    </div>}
  </main>
}
// FOR LATER TO MAKE CAROUSEL WORK

// import React, { useState } from 'react';

// const Carousel = ({ images }) => {
//     // Using state to track the current slide
//     const [currentSlide, setCurrentSlide] = useState(0);

//     // Handling slide navigation
//     const prevSlide = () => {
//         setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length);
//     }

//     const nextSlide = () => {
//         setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
//     }

//     return (
//         <div>
//             {images.map((image, index) => (
//                 currentSlide === index && (
//                     <div key={index} className="carousel-item flex items-center justify-center relative w-full">
//                         <img src={image} className="w-auto h-[500px] object-cover mx-auto" />
//                         <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
//                             <button onClick={prevSlide} className="btn btn-circle">❮</button>
//                             <button onClick={nextSlide} className="btn btn-circle">❯</button>
//                         </div>
//                     </div>
//                 )
//             ))}
//         </div>
//     );
// }

// export default Carousel;
