'use client';

import { useMuseums } from '@/app/contexts/MuseumContext';
import { prisma } from '@/lib/prisma';
// import Image from "next/image";
import Link from 'next/link';
import { Image, Loader, Button, Text, Paper, Container, Group } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { ArrowSmallLeftIcon, ArrowSmallRightIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Heart } from 'tabler-icons-react';

export default function Page({ params }: {
  params: { id: string }
}) {
  const { getMuseumsByField } = useMuseums();
  const [favorited, setFavorited] = useState<Boolean>(false);
  var museum = getMuseumsByField('id', parseInt(params.id))[0];
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchMuseums() {
      try {
        if (session?.user?.id) {
          const res = await fetch(`/api/favorites?userId=${session.user?.id}&museumId=${params.id}`);
          if (!res.ok) {
            throw new Error(`Fetch request failed with status: ${res.status}`);
          }
          const data = await res.json();
          setFavorited(data);
        }
      } catch (error) {
        console.error("Error fetching museums:", error);
        // Handle the error, e.g., show an error message to the user
      }
    }

    fetchMuseums();
  }, [favorited, session])

  const googleMapsLink: string = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(museum?.address || '') + '+' + encodeURIComponent(museum?.city || '') + '+' + encodeURIComponent(museum?.state || '')
  return <main className="h-screen">
    {museum ? (
      <>
        <Paper
          style={{
            height: '75%',
            backgroundImage: `linear-gradient(rgba(255, 255, 255, .7), rgba(255, 255, 255, .7)), url('${museum?.bg_image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-center h-full w-full">
            {museum && (
              <Image
                radius="md"
                h={350}
                w="auto"
                fit="cover"
                alt={museum.name}
                src={museum.main_image || ""}
                style={{ border: "3px solid black", maxWidth: '350px', maxHeight: '350px', boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.2)' }}
              />
            )}
            <div className="ml-2">
              <Text size="2.5rem" style={{ fontWeight: 'bold' }}>{museum?.name}</Text>
              <div className="flex flex-col items-start mt">
                <Button component={Link} href={googleMapsLink} variant="transparent"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: '0', margin: '0' }} color='black'>{museum?.address}, {museum?.city}, {museum?.state}
                </Button>
                <Group>
                  <Button component={Link} href={`/booking?id=${museum?.id}`} size="md" variant="filled" color="#a60000">
                    Book Tickets
                  </Button>
                  {session ? <>
                    {favorited ? <Heart onClick={() => handleFavorite(session.user?.id || '', parseInt(params.id), "DELETE")} size={45} className="fill-red-500 cursor-pointer" />
                      : <Heart onClick={() => handleFavorite(session.user?.id || '', parseInt(params.id), "ADD")} size={45} className="cursor-pointer" />}
                  </> : <></>}
                </Group>
              </div>
            </div>
          </div>
        </Paper>

        {/* About section */}
        <div className="container mx-auto px-5 md:px-20 py-10">
          <Text size="1.125rem" style={{ paddingBottom: '1rem', fontWeight: 'bold' }}>About the Museum:</Text>
          {museum && (
            <div className="mb-10">
              {museum?.description?.split('\\n').map((line, index) => (
                <p key={index} className="text-xl mb-4">
                  {line}
                </p>
              ))}
            </div>
          )}

          <Text size="1.125rem" style={{ paddingBottom: '1rem', fontWeight: 'bold' }}>Additional Photos:</Text>
          <Carousel
            nextControlIcon={<ArrowSmallRightIcon color='black' />}
            previousControlIcon={<ArrowSmallLeftIcon color='black' />}
            loop={true}
            style={{ backgroundColor: '#dedbd9' }}
          >
            <Carousel.Slide>
              <img src={museum?.bg_image || ''} className="w-auto h-[500px] object-cover mx-auto" />
            </Carousel.Slide>
            <Carousel.Slide>
              <img src={museum?.main_image || ''} className="w-auto h-[500px] object-cover mx-auto" />
            </Carousel.Slide>
            <Carousel.Slide>
              <img src={museum?.bg_image || ''} className="w-auto h-[500px] object-cover mx-auto" />
            </Carousel.Slide>
          </Carousel>

        </div>
      </>
    ) : <div className="flex justify-center items-center h-full">
      <Loader />
    </div>}
  </main>
}

async function handleFavorite(userId: string, museumId: number, action: string) {

  if (userId == '') {
    return;
  }

  if (action == "DELETE") {
    const response = await fetch('/api/favorites', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, museumId: museumId }),
    });
    if (response.ok) {
      window.location.reload();
    } else {
      const errorData = await response.json();

    }
  } else if (action == "ADD") {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, museumId: museumId }),
    });
    if (response.ok) {
      window.location.reload();
    } else {
      const errorData = await response.json();

    }
  }
}
