import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';
import { GraphProvider } from '@/Context/GraphContext';


function Node({ node }) {
    return (
        <div>
            <Head title={`${node.title}`} />

            <div className="flex flex-row-reverse flex-between">

                <div className="flex flex-col w-full space-y-1">
                    <div className="">
                        <div className="float-right flex flex-row-reverse">
                            <Link
                                href={route('dashboard')}
                                className="rounded-md bg-slate-600 w-6 h-6 transition duration-150 ease-in-out hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 p-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" className="stroke-white" />
                                </svg>
                            </Link>
                            <Link
                                href={route('dashboard.nodes.edit', node.id)}
                                className="rounded-md bg-slate-600 w-6 h-6 mr-2 transition duration-150 ease-in-out hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-4 -4 29 29" strokeWidth={1.5} stroke="currentColor" className="size-6 p-0.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" className="stroke-white" />
                                </svg>
                            </Link>
                        </div>
                        <div className="dark:text-white text-xl inline break-words">
                            {node.title}
                        </div>
                    </div>
                    <div className="dark:text-gray-400 text-sm italic w-full">
                        [{node.id}] {node.full_name}
                    </div>
                    <br />
                    <div className="dark:text-gray-200 text-sm break-words w-full">
                        {node.description}
                    </div>
                </div>

            </div>
        </div>
    );
}

Node.layout = (page) => <Layout children={page} />;

export default Node;