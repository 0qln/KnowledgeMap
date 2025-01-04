import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

function Dashboard({ nodes, edges, tags, nodeHasTag }) {
    return (
        <>
            <Head title="Dashboard" />
        </>
    );
}

// Attach the persistent layout
Dashboard.layout = (page) => (
    <AppLayout nodes={page.props.nodes} links={page.props.edges} tags={page.props.tags} nodeHasTag={page.props.nodeHasTag}>
        {page}
    </AppLayout>
);

export default Dashboard;
