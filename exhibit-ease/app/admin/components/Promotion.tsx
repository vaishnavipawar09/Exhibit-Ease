import { Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Promo } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Promotion() {
    return <LoadPromotion />;
}

function LoadPromotion() {
    const [promos, setPromos] = useState<Promo[]>([]);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

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

        fetchPromos();
    }, [session]);
    const [opened, { open, close }] = useDisclosure(false);
    const [currEditingPromo, setCurrEditingPromo] = useState(null);

    return (
        <Stack>
            {promos && promos.length > 0 ? promos.map((promo, index) => (
                <div key={index}>
                    <Text>Promo Name: {promo.promoName}, Promo Discount: {promo.discountPercent}, Promo Status: {promo.active.toString()}</Text>

                </div>
            )) : <></>}
        </Stack>
    )
}