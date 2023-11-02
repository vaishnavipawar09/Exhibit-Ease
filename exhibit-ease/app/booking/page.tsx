'use client'

import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { Museum } from '@prisma/client';
// import Image from "next/image";
import { useMuseums } from '../contexts/MuseumContext';
import { Image, Loader, Button, Text, Paper, Container, Accordion, NumberInput, StylesApiProps } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import Link from 'next/link';

export default function BookingPage() {
    const searchParams = useSearchParams();
    const { getMuseumsByField } = useMuseums();
    var museum = getMuseumsByField('id', parseInt(searchParams?.get("id") || "1"))[0];
    var fieldStyles = {
        input: { borderColor: 'black', backgroundColor: 'white' },
    }
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [numberOfTickets, setNumberOfTickets] = useState(1);
    const [promoDiscount, setPromoDiscount] = useState(0);
    const ticketPrice = museum?.cost || 0;
    const [card, setCard] = useState("");
    const [cardName, setCardName] = useState("");
    const [monthYear, setMonthYear] = useState("");
    const [cvv, setcvv] = useState("");

    return <main className="h-screen">
        {museum ? (
            <div>
                <Paper
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, .7), rgba(255, 255, 255, .7)), url('${museum?.bg_image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        padding: '1rem'
                    }}
                >
                    <div className="flex flex-col lg:flex-row items-center justify-center h-full w-full">
                        {museum && (
                            <Image
                                radius="md"
                                h={175}
                                w="auto"
                                fit="cover"
                                alt={museum.name}
                                src={museum.main_image || ""}
                                style={{ border: "3px solid black", maxWidth: '350px', maxHeight: '350px', boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.2)' }}
                            />
                        )}
                        <div className="ml-2">
                            <Text size="2.5rem" style={{ fontWeight: 'bold' }}>{museum?.name}</Text>
                        </div>
                    </div>
                </Paper>

                <Accordion defaultValue="Apples">
                    <Accordion.Item key='1' value='1'>
                        <Accordion.Control>General Info</Accordion.Control>
                        <Accordion.Panel>
                            <NumberInput
                                label="Total tickets"
                                placeholder="Choose a number between 1 and 10"
                                min={1}
                                max={10}
                                value={numberOfTickets}
                                onChange={(e) => {
                                    const newValue = Math.min(10, Math.max(1, Number(e)));
                                    setNumberOfTickets(newValue);
                                }}
                                style={{ maxWidth: '24rem' }}
                                styles={fieldStyles}
                            />
                            <div className="flex flex-wrap items-center my-4">
                                <p className="text-lg font-bold mr-4">Name:</p>
                                <input
                                    className="border-black border-[3px] max-w-sm shadow-2xl"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap items-center my-4">
                                <p className="text-lg font-bold mr-4">Email:</p>
                                <input
                                    className="border-black border-[3px] max-w-sm shadow-2xl"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item key='2' value='2'>
                        <Accordion.Control>Payment Info</Accordion.Control>
                        <Accordion.Panel>
                            <p className="text-3xl font-bold mb-8 text-left">Add payment information</p>

                            <div className="flex flex-wrap items-center my-4">
                                <p className="text-lg font-bold mr-4">Card Number:</p>
                                <input
                                    className="border-black border-[3px] max-w-m shadow-2xl"
                                    type="text"
                                    value={card}
                                    onChange={(e) => setCard(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap items-center my-4">
                                <p className="text-lg font-bold mr-4">Name on Card:</p>
                                <input
                                    className="border-black border-[3px] max-w-m shadow-2xl"
                                    type="text"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap items-center my-4">
                                <p className="text-lg font-bold mr-4">Exp:</p>
                                <input
                                    className="border-black border-[3px] max-w-md shadow-2xl"
                                    type="text"
                                    placeholder="MM/YY"
                                    value={monthYear}
                                    onChange={(e) => setMonthYear(e.target.value)}
                                />
                                <p className="text-lg font-bold mr-4" style={{ marginLeft: '10px' }}>CVV:</p>
                                <input
                                    className="border-black border-[3px] max-w-md shadow-2xl"
                                    type="text"
                                    value={cvv}
                                    onChange={(e) => setcvv(e.target.value)}
                                />
                            </div>
                            <Button color='rgba(166, 0, 0, 1)' component={Link} href={''} style={{ margin: '1.25rem 0' }}>Confirm payment information</Button>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item key='3' value='3'>
                        <Accordion.Control>Total</Accordion.Control>
                        <Accordion.Panel>
                            {displayPriceSection(ticketPrice, .08, promoDiscount, numberOfTickets)}
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
                <Button color='rgba(166, 0, 0, 1)' component={Link} href={`/confirmation?id=${museum?.id}`} style={{ margin: '1.25rem 0' }}>Complete Ticket Payment</Button>
            </div>

        ) : <div className="flex justify-center items-center h-full">
            <Loader />
        </div>}
    </main>
}

function getTotalCost(numberOfTickets: number, ticketPrice: number) {
    const taxRate = .08
    const cost = numberOfTickets * ticketPrice;
    const tax = cost * taxRate;
    const totalCost = cost + tax;
    return totalCost;
}

function getTotalTax(ticketPrice: number) {
    ticketPrice = ticketPrice * .08;
    return ticketPrice;
}

function displayPriceSection(cost: number, tax: number, promoDiscount: number, numberOfTickets: number) {
    return <>
        <div className="border-black border-[3px] my-4 p-4 max-w-md shadow-2xl">
            <div className="flex justify-between">
                <span>Cost:</span>
                <span>${cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Tax:</span>
                <span>${getTotalTax(cost)}</span>
            </div>
            <div className="flex justify-between">
                <span>Promo:</span>
                <span>-${promoDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Total Cost:</span>
                <span>${getTotalCost(numberOfTickets, cost)}</span>
            </div>
        </div>


    </>
}
