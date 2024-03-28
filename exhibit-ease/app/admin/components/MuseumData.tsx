import { useMuseums } from "@/app/contexts/MuseumContext";
import { TextInput, NumberInput, Textarea, Select, Button, Group, Box, SimpleGrid } from '@mantine/core';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Museum, MuseumType } from '@prisma/client';
import { TimeInput } from '@mantine/dates';
export default function MuseumData() {
    const { data: session, status } = useSession();
    const { getMuseumsByField, museums } = useMuseums();
    const [museum, setMuseum] = useState<Museum | null>(null);

    useEffect(() => {
        if (session?.user?.museumId && museums.length > 0) {
            const fetchedMuseum = getMuseumsByField('id', session.user.museumId)[0];
            setMuseum(fetchedMuseum);
        }
    }, [session, museums]);

    if (!museum) {
        return <div>Loading museum data...</div>;
    }

    return <LoadMuseumDataFields museum={museum} />;
}
interface MuseumFormState extends Omit<Museum, 'id' | 'zip' | 'openHour' | 'closeHour'> {
    zip: string;
    openHour: string;
    closeHour: string;
}
interface LoadMuseumDataFieldsProps {
    museum: Museum;
}



function LoadMuseumDataFields({ museum }: LoadMuseumDataFieldsProps) {
    const museumOpenHour = new Date(museum.openHour);
    const museumCloseHour = new Date(museum.closeHour);

    const openHourString = museumOpenHour.toISOString().substring(11, 16);
    const closeHourString = museumCloseHour.toISOString().substring(11, 16);
    const [formState, setFormState] = useState<MuseumFormState>({
        name: museum.name,
        description: museum.description ?? '',
        main_image: museum.main_image ?? '',
        bg_image: museum.bg_image ?? '',
        cost: museum.cost,
        address: museum.address,
        city: museum.city,
        state: museum.state,
        zip: museum.zip.toString().padStart(5, '0'),
        openHour: openHourString,
        closeHour: closeHourString,
        type: museum.type,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleNumberChange = (value: string | number, field: keyof MuseumFormState) => {
        // Ensure we're working with a number if possible
        const numericValue = typeof value === 'number' ? value : parseFloat(value);
        if (!isNaN(numericValue)) {
            setFormState((prevState) => ({
                ...prevState,
                [field]: numericValue,
            }));
        } else {
            // Handle the case where the numeric value is NaN (not a number)
            // For example, you might reset it to a default value or handle as needed
            setFormState((prevState) => ({
                ...prevState,
                [field]: 0, // or some other default or previous value
            }));
        }
    };

    const validateZipCode = (zipString: string): boolean => {
        const numericZip = parseInt(zipString, 10);
        return !isNaN(numericZip) && numericZip >= 501 && numericZip <= 89049;
    };

    //   const submitForm = () => {
    //     // ... validation logic ...

    //     // Convert zip to number before submitting
    //     const zipNumber = parseInt(formState.zip, 10);
    //     if (!validateZipCode(formState.zip)) {
    //       console.error('Invalid zip code');
    //       // Handle invalid zip code
    //       return;
    //     }

    //     // Submit form data with numeric zip
    //     const formData = {
    //       ...formState,
    //       zip: zipNumber,
    //     };

    //     // ... submit logic ...
    //   };


    return (
        <Box style={{ maxWidth: 800 }} mx="auto">
            <form>
                <SimpleGrid cols={2} spacing="md">
                    <TextInput
                        label="Museum Name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                    />
                    <TextInput
                        label="City"
                        name="city"
                        value={formState.city}
                        onChange={handleChange}
                    />
                    <TextInput
                        label="State"
                        name="state"
                        value={formState.state}
                        onChange={handleChange}
                    />
                    <TextInput
                        label="Zip Code"
                        name="zip"
                        value={formState.zip}
                        onChange={handleChange}
                        onBlur={(event) => {
                            if (!validateZipCode(event.currentTarget.value)) {
                                console.error('Zip code is out of range');
                                // Handle the error state, e.g., show an error message
                            }
                        }}
                        maxLength={5}
                    />
                    <NumberInput
                        label="Cost"
                        name="cost"
                        value={formState.cost}
                        onChange={(value) => handleNumberChange(value ?? museum.cost, 'cost')}
                        decimalScale={2}
                        prefix="$"
                    />
                    <Select
                        label="Type"
                        name="type"
                        value={formState.type}
                        onChange={(value) => setFormState(prev => ({ ...prev, type: value as MuseumType }))}
                        data={Object.keys(MuseumType)}
                    />
                </SimpleGrid>

                <Textarea
                    label="Description"
                    name="description"
                    value={formState.description || ''}
                    onChange={handleChange}
                    autosize
                    minRows={2}
                    maxRows={6}
                />

                {/* const saveOpenHour = new Date(
  museum.openHour.split('T')[0] + 'T' + formState.openHour + ':00.000Z'
); */}

                <TimeInput
                    label="Opening Hour"
                    name="openHour"
                    value={formState.openHour}
                    onChange={(event) => setFormState(prev => ({ ...prev, openHour: event.currentTarget.value }))}
                    mt="md"
                />

                <TimeInput
                    label="Closing Hour"
                    name="closeHour"
                    value={formState.closeHour}
                    onChange={(event) => setFormState(prev => ({ ...prev, openHour: event.currentTarget.value }))}
                    mt="md"
                />


                {/* More inputs for images and address can be added here */}

                <Group align="right" mt="md">
                    <Button type="submit">Save changes</Button>
                </Group>
            </form>
        </Box>
    );
}