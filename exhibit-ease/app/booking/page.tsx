'use client'

import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { Museum } from '@prisma/client';
// import Image from "next/image";
import { useMuseums } from '../contexts/MuseumContext';
import { Image, Loader, Button, Text, Paper, Container, Accordion, NumberInput, StylesApiProps, Group, Box } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { TextInput, Space } from '@mantine/core';
import Link from 'next/link';
import { useForm } from '@mantine/form';
import { useSession } from "next-auth/react";

var fieldStyles = {
    input: { borderColor: 'black', backgroundColor: 'white' },
}

export default function BookingPage() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const { getMuseumsByField } = useMuseums();
    var museum = getMuseumsByField('id', parseInt(searchParams?.get("id") || "1"))[0];
    const ticketPrice = museum?.cost || 0;

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

                <CreditCardForm ticketPrice={ticketPrice} promoDiscount={0} />


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
    const ticketCost = cost * numberOfTickets
    return <>
        <div className="border-black border-[3px] my-4 p-4 max-w-md shadow-2xl">
            <div className="flex justify-between">
                <span>Cost:</span>
                <span>${ticketCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Tax:</span>
                <span>${getTotalTax(ticketCost).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Promo:</span>
                <span>-${promoDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Total Cost:</span>
                <span>${getTotalCost(numberOfTickets, cost).toFixed(2)}</span>
            </div>
        </div>


    </>
}

export function CreditCardForm({ ticketPrice, promoDiscount }: { ticketPrice: number, promoDiscount: number }) {
    // Initialize form with validation rules
    const { data: session } = useSession();
    const form = useForm({
        initialValues: {
            totalTickets: 0,
            name: session ? session.user?.name : '',
            email: session ? session.user?.email : '',
            cardNumber: '',
            expDate: '',
            cvv: '',
            zipCode: '',
        },

        validate: {
            cardNumber: (value) => (/^\d{16}$/.test(value) ? null : 'Invalid card number'),
            expDate: (value) => (/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(value) ? null : 'Invalid date'),
            cvv: (value) => (/^\d{3,4}$/.test(value) ? null : 'Invalid CVV'),
            zipCode: (value) => (/^\d{5}$/.test(value) ? null : 'Invalid ZIP code'),
        },
    });

    const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, ''); // Remove non-digits
        form.setFieldValue('cardNumber', value.slice(0, 16))
    };

    const handleExpDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, '');
        let formattedValue = value;
        if (value.length >= 3) {
            // Add a slash after the second digit if the length is at least 3
            formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
        }
        form.setFieldValue('expDate', formattedValue)
    };

    const handleCvvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, ''); // Remove non-digits
        form.setFieldValue('cvv', value.slice(0, 3))
    };

    const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, ''); // Remove non-digits
        form.setFieldValue('zipCode', value.slice(0, 5))
    };

    return (
        <Box style={{ maxWidth: 300 }}>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>


                <p className="text-3xl font-bold mb-8 text-left"> General Info</p>
                <NumberInput
                    label="Total tickets"
                    placeholder="Choose a number between 1 and 10"
                    min={1}
                    max={10}
                    {...form.getInputProps('totalTickets')}
                    style={{ maxWidth: '24rem' }}
                    styles={fieldStyles}
                />
                <div className="flex flex-wrap items-center my-4">
                    <Text fw={700}  >Name: </Text>
                    <Space w="md" />
                    <TextInput
                        {...form.getInputProps('name')}
                        style={{ maxWidth: '24rem' }}
                        styles={fieldStyles}
                    />
                </div>

                <div className="flex flex-wrap items-center my-4">
                    <Text fw={700}  >Email: </Text>
                    <Space w="md" />
                    <TextInput
                        {...form.getInputProps('email')}
                        style={{ maxWidth: '24rem' }}
                        styles={fieldStyles}
                    />
                </div>

                <p className="text-3xl font-bold mb-8 text-left">Add payment information</p>

                <TextInput
                    required
                    label="Card Number"
                    placeholder="1234 1234 1234 1234"
                    {...form.getInputProps('cardNumber')}
                    error={form.errors.cardNumber}
                    onChange={handleCardNumberChange}
                    styles={fieldStyles}
                />

                <TextInput
                    required
                    label="Expiration Date"
                    placeholder="MM/YY"
                    {...form.getInputProps('expDate')}
                    error={form.errors.expDate}
                    onChange={handleExpDateChange}
                    styles={fieldStyles}
                />

                <TextInput
                    required
                    label="CVV"
                    placeholder="123"
                    {...form.getInputProps('cvv')}
                    error={form.errors.cvv}
                    onChange={handleCvvChange}
                    styles={fieldStyles}
                />

                <TextInput
                    required
                    label="ZIP Code"
                    placeholder="12345"
                    {...form.getInputProps('zipCode')}
                    error={form.errors.zipCode}
                    onChange={handleZipCodeChange}
                    styles={fieldStyles}
                />

                <Group mt="md">
                    <Button color='rgba(166, 0, 0, 1)' type="submit" style={{ margin: '1.25rem 0' }}>Confirm payment information</Button>
                </Group>
                {displayPriceSection(ticketPrice, .08, promoDiscount, form.values.totalTickets)}
            </form>

        </Box>
    );
}
