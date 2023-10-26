'use client'

import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { Museum } from '@prisma/client';
import Image from "next/image";
import { useMuseums } from '../contexts/MuseumContext';


export default function BookingPage() {
    const searchParams = useSearchParams();
    const { getMuseumsByField } = useMuseums();
    var museums = getMuseumsByField('id', parseInt(searchParams?.get("id") || "1"))[0];

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [numberOfTickets, setNumberOfTickets] = useState(1);
    const [promoDiscount, setPromoDiscount] = useState(0);
    const ticketPrice = museums?.cost || 0;
    const [card, setCard] = useState("");
    const [cardName, setCardName] = useState("");
    const [monthYear, setMonthYear] = useState("");
    const [cvv, setcvv] = useState("");

    return <main className="h-screen">
        {museums ? (
            <div>
                <div className="hero h-3/4"
                    style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, .6), rgba(255, 255, 255, .6)), url('${museums?.bg_image}')` }}>

                    <div className="hero-content flex-col lg:flex-row">
                        {museums && (
                            <Image
                                src={museums?.main_image || ""}
                                alt={museums?.name}
                                width={100}
                                height={100}
                                className="w-[100px] h-[100px] rounded-xl border-black border-[3px] max-w-sm shadow-2xl"
                            />
                        )}
                        <div className='mx-auto text-center'>
                            <h1 className="text-6xl font-bold mb-4 text-center">{museums?.name}</h1>
                            <div className="flex flex-col items-center"></div>
                        </div>
                    </div>
                </div>

                <div className="collapse collapse-plus bg-base-200">
                    <input type="radio" name="my-accordion-3" defaultChecked={true} />
                    <div className="collapse-title text-xl font-bold">
                        General Info
                    </div>
                    <div className="collapse-content">
                        <p className="text-lg font-bold mb-4">Number of tickets (1-10) :</p>
                        <input
                            className="border-black border-[3px] max-w-sm shadow-2xl"
                            type="number"
                            value={numberOfTickets}
                            onChange={(e) => {
                                const newValue = Math.min(10, Math.max(1, parseInt(e.target.value, 10)));
                                setNumberOfTickets(newValue);
                            }}
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
                    </div>
                </div>
                <div className="collapse collapse-plus bg-base-200">
                    <input type="radio" name="my-accordion-3" />
                    <div className="collapse-title text-xl font-bold">
                        Payment Info
                    </div>
                    <div className="collapse-content">
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
                        <a href={''} className="btn btn-primary">Confirm payment information</a>
                    </div>
                </div>
                <div className="collapse collapse-plus bg-base-200">
                    <input type="radio" name="my-accordion-3" />
                    <div className="collapse-title text-xl font-bold">
                        Confirmation Section
                    </div>
                    <div className="collapse-content">
                        {displayPriceSection(ticketPrice, .08, promoDiscount, numberOfTickets)}
                    </div>
                </div>

                <a href={`/confirmation?id=${museums?.id}`} className="btn btn-primary my-4">Complete Ticket Payment</a>
            </div>

        ) : <div className="flex justify-center items-center h-full">
            Loading...
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
