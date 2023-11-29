'use client'

import { ChangeEvent, useEffect, useState } from 'react';
import { useMuseums } from '../contexts/MuseumContext';
import { Image, Loader, Button, Text, Paper, Container, Accordion, NumberInput, StylesApiProps, Group, Box } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { TextInput, Space, Tabs, Checkbox } from '@mantine/core';
import Link from 'next/link';
import { useForm } from '@mantine/form';
import { useSession } from "next-auth/react";
import { useRoleRedirect } from '../components/useRoleRedirect';

var fieldStyles = {
    input: { borderColor: 'black', backgroundColor: 'white' },
}

export default function Page() {

    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<string | null>('first');
    const { getMuseumsByField } = useMuseums();
    var empMuseumId = session?.user?.museumId;
    var museum = getMuseumsByField('id', empMuseumId || 1)[0];

    useRoleRedirect();

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
                                height={175}
                                width="auto"
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

                <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List style={{ paddingTop: '1rem' }}>
                        <Tabs.Tab value="first" color='rgba(166, 0, 0, 1)' style={{ fontSize: '1.25rem' }}>Card</Tabs.Tab>
                        <Tabs.Tab value="second" color='rgba(166, 0, 0, 1)' style={{ fontSize: '1.25rem' }}>Cash</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="first">
                        <CreditCardForm ticketPrice={ticketPrice} />
                    </Tabs.Panel>
                    <Tabs.Panel value="second">
                        <CashForm ticketPrice={ticketPrice} />
                    </Tabs.Panel>
                </Tabs>


                <Button color='rgba(166, 0, 0, 1)' component={Link} href={`/confirmation?id=${museum?.id}`} style={{ margin: '1.25rem 0' }}>Complete Ticket Payment</Button>
            </div>

        ) : <div className="flex justify-center items-center h-full">
            <Loader />
        </div>}
    </main>
}

function getTotalCost(numberOfTickets: number, ticketPrice: number, giftShop: boolean, cafe: boolean, promoDiscount: number) {
    const taxRate = .08
    var cost = numberOfTickets * ticketPrice;
    if (giftShop == true) {
        cost = cost + 5;
    }
    if (cafe == true) {
        cost = cost + 5;
    }
    const tax = cost * taxRate;
    if (promoDiscount != 0) {
        var totalCost = (cost * (1 - (promoDiscount / 100))) + tax
    } else {
        var totalCost = (cost + tax)
    }
    return totalCost;
}


function getTotalTax(ticketPrice: number) {
    ticketPrice = ticketPrice * .08;
    return ticketPrice;
}

function displayPriceSectionCard(cost: number, tax: number, promoDiscount: number, numberOfTickets: number, giftShop: boolean, cafe: boolean) {
    if (promoDiscount == undefined) {
        promoDiscount = 0;
    }
    promoDiscount = promoDiscount * 100
    var ticketCost = cost * numberOfTickets
    if (giftShop == true) {
        ticketCost = ticketCost + 5;
    }
    if (cafe == true) {
        ticketCost = ticketCost + 5;
    }
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
                <span>-{promoDiscount.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
                <span>Total Cost:</span>
                <span>${getTotalCost(numberOfTickets, cost, giftShop, cafe, promoDiscount).toFixed(2)}</span>
            </div>
        </div>


    </>
}

function displayPriceSectionCash(cost: number, tax: number, promoDiscount: number, numberOfTickets: number, amountPaid: number, giftShop: boolean, cafe: boolean) {
    if (promoDiscount == undefined) {
        promoDiscount = 0;
    }
    promoDiscount = promoDiscount * 100
    var ticketCost = cost * numberOfTickets
    if (giftShop == true) {
        ticketCost = ticketCost + 5;
    }
    if (cafe == true) {
        ticketCost = ticketCost + 5;
    }
    const amountDue = amountPaid - getTotalCost(numberOfTickets, cost, giftShop, cafe, promoDiscount)
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
                <span>-{promoDiscount.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
                <span>Total Cost:</span>
                <span>${getTotalCost(numberOfTickets, cost, giftShop, cafe, promoDiscount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span>${amountPaid}</span>
            </div>
            <div className="flex justify-between">
                <span>Amount Due:</span>
                <span>${amountDue.toFixed(2)}</span>
            </div>
        </div>


    </>
}

function CreditCardForm({ ticketPrice }: { ticketPrice: number }) {
    // Initialize form with validation rules
    const { data: session } = useSession();
    const { getMuseumsByField } = useMuseums();
    var empMuseumId = session?.user?.museumId;
    var museum = getMuseumsByField('id', empMuseumId || 1)[0];
    const form = useForm({
        initialValues: {
            totalTickets: 0,
            giftShop: false,
            cafe: false,
            name: session ? session.user?.name : '',
            cardNumber: '',
            expDate: '',
            cvv: '',
            zipCode: '',
            promo: '',
            promoVal: 0,
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

    const handlePromo = async () => {
        const promo = await fetch(`/api/promos?promoId=${form.values.promo}`)
        if (promo.ok) {
            const res = await promo.json();
            if (res.museumId === museum.id) {
                form.setFieldValue('promoVal', res.discountPercent);
            }
        }
    };

    return (
        <Box style={{ maxWidth: 300 }}>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>


                <p className="text-3xl font-bold mb-8 my-4 text-left"> General Info</p>
                <NumberInput
                    label="Total tickets"
                    placeholder="Choose a number between 1 and 10"
                    min={1}
                    max={10}
                    {...form.getInputProps('totalTickets')}
                    style={{ maxWidth: '24rem' }}
                    styles={fieldStyles}
                />
                <Checkbox className="flex flex-wrap items-center my-4"
                    label="Add Giftshop access"
                    {...form.getInputProps('giftShop')}
                    color='rgba(166, 0, 0, 1)'
                />
                <Checkbox className="flex flex-wrap items-center"
                    label="Add Cafe access"
                    {...form.getInputProps('cafe')}
                    color='rgba(166, 0, 0, 1)'
                />
                <div className="flex flex-wrap items-center my-4">
                    <Text style={{ fontWeight: 700 }}>Name: </Text>
                    <Space style={{ width: '20px' }} />
                    <TextInput
                        {...form.getInputProps('name')}
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

                <Group style={{ marginTop: 'md' }}>
                    <TextInput
                        label="Add a promo code"
                        {...form.getInputProps('promo')}
                        styles={fieldStyles}
                    />
                    <Button
                        color='rgba(166, 0, 0, 1)'
                        style={{ margin: '1.25rem 0' }}
                        onClick={(e) => handlePromo()}
                    >Apply Promo
                    </Button>
                </Group>
                {displayPriceSectionCard(ticketPrice, .08, form.values.promoVal, form.values.totalTickets, form.values.giftShop, form.values.cafe)}
            </form>

        </Box>
    );
}

function CashForm({ ticketPrice }: { ticketPrice: number }) {
    // Initialize form with validation rules
    const { data: session } = useSession();
    const { getMuseumsByField } = useMuseums();
    var empMuseumId = session?.user?.museumId;
    var museum = getMuseumsByField('id', empMuseumId || 1)[0];
    const form = useForm({
        initialValues: {
            totalTickets: 0,
            amountPaid: 0,
            giftShop: false,
            cafe: false,
            name: session ? session.user?.name : '',
            email: session ? session.user?.email : '',
            promo: '',
            promoVal: 0
        },
    });

    const handlePromo = async () => {
        const promo = await fetch(`/api/promos?promoId=${form.values.promo}`)
        if (promo.ok) {
            const res = await promo.json();
            if (res.museumId === museum.id || res.active === true) {
                form.setFieldValue('promoVal', res.discountPercent);
            }
        }
    };

    return (
        <Box style={{ maxWidth: 300 }}>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <p className="text-3xl font-bold mb-8 my-4 text-left"> General Info</p>
                <NumberInput
                    label="Total tickets"
                    placeholder="Choose a number between 1 and 10"
                    min={1}
                    max={10}
                    {...form.getInputProps('totalTickets')}
                    style={{ maxWidth: '24rem' }}
                    styles={fieldStyles}
                />
                <Checkbox className="flex flex-wrap items-center my-4"
                    label="Add Giftshop access"
                    {...form.getInputProps('giftShop')}
                    color='rgba(166, 0, 0, 1)'

                />
                <Checkbox className="flex flex-wrap items-center"
                    label="Add Cafe access"
                    {...form.getInputProps('cafe')}
                    color='rgba(166, 0, 0, 1)'
                />
                <div className="flex flex-wrap items-center my-4">
                    <Text style={{ fontWeight: 700 }}>Name: </Text>
                    <Space style={{ width: '20px' }} />
                    <TextInput
                        {...form.getInputProps('name')}
                        style={{ maxWidth: '24rem' }}
                        styles={fieldStyles}
                    />
                </div>

                <div className="flex flex-wrap items-center my-4">
                    <Text style={{ fontWeight: 700 }}>Amount Paid: </Text>
                    <Space style={{ width: '20px' }} />
                    <NumberInput
                        decimalScale={2}
                        fixedDecimalScale
                        defaultValue={2.2}
                        {...form.getInputProps('amountPaid')}
                        style={{ maxWidth: '24rem' }}
                        styles={fieldStyles}
                    />
                </div>

                <Group style={{ marginTop: 'md' }}>
                    <TextInput
                        label="Add a promo code"
                        {...form.getInputProps('promo')}
                        styles={fieldStyles}
                    />
                    <Button
                        color='rgba(166, 0, 0, 1)'
                        style={{ margin: '1.25rem 0' }}
                        onClick={(e) => handlePromo()}
                    >Apply Promo
                    </Button>
                </Group>

                {displayPriceSectionCash(ticketPrice, .08, form.values.promoVal, form.values.totalTickets, form.values.amountPaid, form.values.giftShop, form.values.cafe)}

            </form>

        </Box>
    );
}