import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';


function Node({
    node,
    nodes, edges, tags, nodeHasTag
}) {
    return (
        <>
            <Head title="Node" />

            <div className="
                flex flex-row-reverse flex-between 
                dark:bg-gray-800 m-4 p-4
            ">

                <Link 
                    href={route('dashboard', node.id)}
                    className="rounded-md bg-slate-600 w-6 h-6 transition duration-150 ease-in-out hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" className="stroke-white" />
                    </svg>
                </Link>

                <div className="flex flex-col">
                    <div className="dark:text-white text-xl">
                        {node.title}
                    </div>
                    <div className="dark:text-gray-400 italic">
                        {node.full_name}
                    </div>
                    <br />
                    <div className="dark:text-gray-200 text-wrap">
                        {node.description}
                    </div>
                </div>

            </div>
        </>
    );
}

Node.layout = (page) => (
    <AppLayout
        nodes={page.props.nodes}
        links={page.props.edges}
        tags={page.props.tags}
        nodeHasTag={page.props.nodeHasTag}
        childrenRight={page} />
);

export default Node;