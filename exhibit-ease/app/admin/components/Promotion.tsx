import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Promotion() {
    return <LoadPromotion />;
}

function LoadPromotion() {
    const [promos, setPromos] = useState([]);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchPromos = async () => {

            if (session) {
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
        console.log(promos);
    }, []);

    return (
        <div>
            <h1>Promotion</h1>
        </div>
    )
}