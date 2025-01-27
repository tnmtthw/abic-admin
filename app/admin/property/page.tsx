'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Property } from '@/app/utils/types';
import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import LoadingDot from '@/components/loading-dot';
import { Button, Link } from '@nextui-org/react';


const fetchWithToken = async (url: string) => {
    const token = sessionStorage.getItem('token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    return response.json();
};

const columns: Column<Property>[] = [
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    { key: 'price', label: 'Min Price', render: (property) => `₱${parseFloat(property.price).toFixed(2)}` },
    {
        key: 'id', label: '', render: (property) => (
            <Link href={`/admin/property/${property.id}`} className="w-full">
                <Button size="sm" className="w-full">
                    Details
                </Button >
            </Link>
        ),
    },
    // { key: 'logo', label: 'Logo', render: (property) => <img src={property.logo} alt={property.name} className="h-12 w-12 object-contain" /> },
    // { key: 'min_price', label: 'Min Price', render: (property) => `₱${parseFloat(property.min_price).toFixed(2)}` },
    // { key: 'max_price', label: 'Max Price', render: (property) => `₱${parseFloat(property.max_price).toFixed(2)}` },
];


export default function Property() {
    const router = useRouter();
    const { data, error } = useSWR<{ code: number; message: string; records: Property[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`,
        fetchWithToken
    );

    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        if (data && data.records) {
            setProperties(data.records);
        }
    }, [data]);

    const handleAction = (property: Property) => {
        console.log('Action clicked for property:', property);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <LoadingDot />;
    }

    return (
        <main className="container mx-auto p-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Property Table</h1>
                <Button color="primary" onPress={() => router.push('/admin/property/new-property')}>
                    Add new property
                </Button>
            </div>
            <DataTable<Property>
                data={properties}
                columns={columns}
                itemsPerPage={5}
                onAction={handleAction}
                actionLabel="Edit"
            />
        </main>
    );
}
