'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';

import AddUserModal from './add-user-modal';
import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import LoadingDot from '@/components/loading-dot';
import EditUserModal from './edit-user-modal';
import { Card, CardBody } from '@heroui/react';

type User = {
    id: number;
    name: string;
    email: string;
    type: string;
};

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

    console.log(response);
    return response.json();
};

const columns: Column<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'type', label: 'type' },
];

export default function Home() {
    const { data, error } = useSWR<{ code: number; message: string; records: User[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
        fetchWithToken
    );

    console.log(data);
    const [users, setUser] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (data && data.records) {
            setUser(data.records);
        }
    }, [data]);

    const handleAction = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <LoadingDot />;
    }

    return (
        <section className="pt-24 px-4 md:px-12">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">User Table</h1>
                <AddUserModal />
            </div>


            <div className='py-6'>
                <Card>
                    <CardBody>
                        <DataTable<User>
                            data={users}
                            columns={columns}
                            itemsPerPage={5}
                            onAction={handleAction}
                            actionLabel="Edit"
                        />
                    </CardBody>
                </Card>
            </div>


            {selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </section>
    );
}
