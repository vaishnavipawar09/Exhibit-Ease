import { useMuseums } from "@/app/contexts/MuseumContext";
import { Stack, Card, Text, Button, Modal, TextInput, Switch, LoadingOverlay, NumberInput, SimpleGrid, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Promo } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Plus } from "tabler-icons-react";

export default function Promotion() {
    return <LoadPromotion />;
}

function LoadPromotion() {
    const [promos, setPromos] = useState<Promo[]>([]);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);
    const [currEditingPromo, setCurrEditingPromo] = useState<Promo | null>(null);
    const { getMuseumsByField, museums } = useMuseums();
    const [museumName, setMuseumName] = useState('');
    const form = useForm({
        initialValues: {
            id: 0,
            promoName: '',
            discountPercent: 0.0,
            active: false,
            museumId: 0,
            museumName: '',
        },
    });

    const fetchPromos = async () => {
        if (session?.user?.museumId) {
            try {
                const response = await fetch(`/api/promos?museumId=${session?.user?.museumId}`);
                if (response.ok) {
                    const data = await response.json();
                    setPromos(data);
                } else {
                    console.error('Error fetching user details:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (session?.user?.museumId && museums.length > 0) {
            const fetchedMuseum = getMuseumsByField('id', session.user.museumId)[0];
            setMuseumName(fetchedMuseum.name);
        }

        fetchPromos();
    }, [session]);

    const handleEdit = (promo: Promo, newP: Boolean) => {

        if (newP) {
            setCurrEditingPromo(null);
            form.setValues({
                id: 0,
                promoName: '',
                discountPercent: 0.0,
                active: true,
                museumId: session?.user?.museumId || 0,
                museumName: museumName,
            });
            open();
        } else {
            setCurrEditingPromo(promo);
            form.setValues({ ...promo, museumId: session?.user?.museumId || 0 });
            open();
        }
    };

    const handleSubmit = async (promo: Promo) => {
        if (currEditingPromo?.promoName == promo.promoName && currEditingPromo?.active == promo.active && currEditingPromo?.discountPercent == promo.discountPercent) {
            return close();
        }
        var updatePromo = await fetch('/api/promos',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(promo),
            }
        );
        if (updatePromo.ok) {
            await fetchPromos();
            close();
            setCurrEditingPromo(null);
        }
    }

    return (
        <Stack align="flex-start"
            justify="flex-start">
            <LoadingOverlay visible={loading} />
            <Button onClick={() => handleEdit({} as Promo, true)} rightSection={<Plus />} size="xs">Add Promo</Button>
            <Title>Your Promos</Title>
            <SimpleGrid cols={3}>
                {promos && promos.length > 0 ? promos.map((promo, index) => (
                    <Card key={index} shadow="sm" padding="lg">
                        <Text truncate="end">Promo Name: {promo.promoName}</Text>
                        <Text>Discount: {(promo.discountPercent * 100).toFixed(1)}%</Text>
                        <Switch labelPosition="left" label="Status" checked={promo.active} />
                        <Button mt="sm" onClick={() => handleEdit(promo, false)}>Edit</Button>
                    </Card>
                )) : <Text>No promotions available</Text>}
            </SimpleGrid>

            <Modal opened={opened} onClose={() => { setCurrEditingPromo(null); close(); }} title={`${currEditingPromo ? "Edit Promotion" : "Add Promotion"}`}>
                <form onSubmit={form.onSubmit((values) => { handleSubmit(values) })}>
                    <TextInput label="Promo Name" {...form.getInputProps('promoName')} />
                    <NumberInput clampBehavior="strict"
                        min={0} max={1} allowDecimal={true} decimalScale={3} label="Discount Percent (value must be: 0.000 <= value <= 1"  {...form.getInputProps('discountPercent')} />
                    <Switch mt="sm" labelPosition="left" label="Active" checked={form.values.active} onClick={() => { form.setFieldValue('active', !currEditingPromo?.active) }} {...form.getInputProps('active')} />
                    <Button mt="sm" type="submit">{currEditingPromo ? "Update Promo" : "Create Promo"}</Button>
                </form>
            </Modal>
        </Stack>
    )
}
