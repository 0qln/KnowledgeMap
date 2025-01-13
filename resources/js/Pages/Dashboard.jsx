import { Head } from '@inertiajs/react';
import GraphLayout from '@/Layouts/GraphLayout';

function Dashboard({}) {
    return <Head title="Dashboard" />;
}

Dashboard.layout = (page) => <GraphLayout children={page}/>;

export default Dashboard;