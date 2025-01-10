import { Head, Link } from '@inertiajs/react';
import GraphDetailsLayout from '@/Layouts/GraphDetailsLayout';
import GraphLayout from '@/Layouts/GraphLayout';

function Edge({ edge, from, to, }) {
    return (
        <div>
            <Head title={`Edge ${edge.id}`} />

            <div className="flex flex-row-reverse flex-between">

                <div className="flex flex-col w-full space-y-2">
                    <div className="">
                        <div className="float-right flex flex-row-reverse">
                            <Link
                                href={route('dashboard', edge.id)}
                                className="rounded-md bg-slate-600 w-6 h-6 transition duration-150 ease-in-out hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 p-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" className="stroke-white" />
                                </svg>
                            </Link>
                            <Link
                                href={route('dashboard.edges.edit', edge.id)}
                                className="rounded-md bg-slate-600 w-6 h-6 mr-2 transition duration-150 ease-in-out hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-4 -4 29 29" strokeWidth={1.5} stroke="currentColor" className="size-6 p-0.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" className="stroke-white" />
                                </svg>
                            </Link>
                        </div>
                        <div className="dark:text-white text-xl inline break-words">
                            Edge #{edge.id}
                        </div>
                    </div>
                    <div className="flex flex-row space-x-2 flex-wrap">
                        <Link 
                            href={route('dashboard.nodes.show', from.id)}
                            className="dark:text-gray-400 italic text-sm break-words hover:underline">
                            [#{from.id}] {from.title}
                        </Link>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" className="stroke-gray-400"/>
                            </svg>
                        </div>
                        <Link 
                            href={route('dashboard.nodes.show', to.id)}
                            className="dark:text-gray-400 italic text-sm break-words hover:underline">
                            [#{to.id}] {to.title}
                        </Link>
                    </div>
                    <div className="dark:text-gray-400 italic text-sm break-words w-full">
                        Weight: {edge.weight}
                    </div>
                    <div className="dark:text-gray-200 text-sm break-words w-full">
                        {edge.description}
                    </div>
                </div>

            </div>
        </div>
    );
}

Edge.layout = (page) => 
    (<GraphLayout childrenRight={
        <GraphDetailsLayout children={
            page
        }/>
    }/>
);

export default Edge;