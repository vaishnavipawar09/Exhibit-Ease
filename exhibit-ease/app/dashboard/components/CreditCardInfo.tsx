'use client';

import { Button, Text, NumberInput, Group, Box } from '@mantine/core';
import { TextInput, Space, Checkbox } from '@mantine/core';
import Link from 'next/link';
import { useForm } from '@mantine/form';
import { useSession } from "next-auth/react";
import { useRoleRedirect } from '../../components/useRoleRedirect';


var fieldStyles = {
    input: { borderColor: 'black', backgroundColor: 'white' },
}

export default function CreditCardForm() {
    // Initialize form with validation rules
    const { data: session } = useSession();
    const form = useForm({
        initialValues: {
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

                <Button color='rgba(166, 0, 0, 1)' component={Link} href="#" style={{ margin: '1.25rem 0' }}>Update Credit Card info</Button>

            </form>

        </Box>
    );
}