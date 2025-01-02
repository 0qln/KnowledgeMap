import { Graph } from '@/Components/Graph';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { miserables } from '../../../public/miserables.json';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Knowledge Map
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Graph pNodes={miserables.nodes} pLinks={miserables.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
