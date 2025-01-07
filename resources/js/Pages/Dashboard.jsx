import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { GraphProvider } from '@/Context/GraphContext';

function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
        </>
    );
}

// Attach the persistent layout
Dashboard.layout = (page) => ( <Layout> {page} </Layout>);

export default Dashboard;
