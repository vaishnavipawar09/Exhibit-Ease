'use client';

import { Button, Text, NumberInput, Group, Box } from '@mantine/core';
import { TextInput, Space, Checkbox } from '@mantine/core';
import Link from 'next/link';
import { useForm } from '@mantine/form';
import { useSession } from "next-auth/react";
import { useRoleRedirect } from '../../components/useRoleRedirect';
import { useEffect, useState } from 'react';
import { Heart } from 'tabler-icons-react';
import { CreditCardInfo } from '@prisma/client';

var fieldStyles = {
    input: { borderColor: 'black', backgroundColor: 'white' },
}

export default function CreditCardForm() {
    // Initialize form with validation rules
    const { data: session } = useSession();
    const [cardDetails, setCard] = useState<CreditCardInfo>({} as CreditCardInfo);
    const form = useForm({
        initialValues: {
            id: '',
            cardNumber: '',
            expDate: '',
            securityCode: '',
            userId: '',
            zipCode: '',
        },

        validate: {
            cardNumber: (value) => (/^\d{16}$/.test(value) ? null : 'Invalid card number'),
            expDate: (value) => (/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(value) ? null : 'Invalid date'),
            securityCode: (value) => (/^\d{3,4}$/.test(value) ? null : 'Invalid CVV'),
            zipCode: (value) => (/^\d{5}$/.test(value) ? null : 'Invalid ZIP code'),
        },
    });

    useEffect(() => {
        async function fetchCard() {
            try {
                if (session?.user?.id) {
                    const res = await fetch(`/api/card?userId=${session.user?.id}`);
                    if (!res.ok) {
                        throw new Error(`Fetch request failed with status: ${res.status}`);
                    }
                    const data = await res.json();
                    // setCard(data);
                    // form.setInitialValues({
                    //     id: data.id,
                    //     cardNumber: data.cardNumber,
                    //     expDate: data.expiration,
                    //     securityCode: data.securityCode,
                    //     userId: data.userId,
                    //     zipCode: data.zipcode,
                    // });
                    form.setFieldValue("id", data.id);
                    form.setFieldValue("cardNumber", data.cardNumber);
                    form.setFieldValue("expDate", data.expiration);
                    form.setFieldValue("securityCode", data.securityCode);
                    form.setFieldValue("userId", data.userId);
                    form.setFieldValue("zipCode", data.zipcode);

                }
            } catch (error) {
                console.error("Error fetching museums:", error);
                // Handle the error, e.g., show an error message to the user
            }
        }

        fetchCard();
    }, [session?.user?.id])

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
                    {...form.getInputProps('securityCode')}
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

                <Button onClick={() => handleCreditCardInfo(
                    form.values.id,
                    session?.user?.id || '',
                    form.values.cardNumber,
                    form.values.expDate,
                    form.values.securityCode,
                    form.values.zipCode,
                    "UPDATE")} color='rgba(166, 0, 0, 1)' component={Link} href="#" style={{ margin: '1.25rem 0' }}>Update Credit Card info</Button>

            </form>

        </Box>
    );
}


async function handleCreditCardInfo(id: string, userId: string, cardNumber: String, expiration: String, securityCode: String, zipcode: String, action: string) {

    if (userId == '') {
        return;
    }

    if (action == "UPDATE") {
        const response = await fetch('/api/card', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, userId: userId, cardNumber: cardNumber, expiration: expiration, securityCode: securityCode, zipcode: zipcode }),
        });
        if (response.ok) {
            window.location.reload();
        } else {
            const errorData = await response.json();

        }
    }
}
