import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { GraphProvider } from '@/Context/GraphContext';

function Dashboard({ nodes, edges, tags, nodeHasTag }) {
    return (
        <>
            <Head title="Dashboard" />
        </>
    );
}

// Attach the persistent layout
Dashboard.layout = (page) => (
    <GraphProvider>
        <AppLayout>
            {page}
        </AppLayout>
    </GraphProvider>
);

export default Dashboard;
