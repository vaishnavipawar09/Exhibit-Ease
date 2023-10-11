import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Handling request in museums");
    try {
        const museums = await prisma.museum.findMany();
        res.json(museums);
        console.log(museums);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the data." });
    }
}
