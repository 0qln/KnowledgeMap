import { Head, Link } from '@inertiajs/react';
import GraphDetailsLayout from '@/Layouts/GraphDetailsLayout';
import GraphLayout from '@/Layouts/GraphLayout';
import { useGraph } from '@/Hooks/useGraph';

function Edge({ edge, from, to, }) {
    const { setLinks, resetLinksForNode } = useGraph();
    const onDelete = () => {
        setLinks(prevLinks => prevLinks.map(l => l.id === edge.id ? { ...l, deleted: true } : l));
        resetLinksForNode(from);
        resetLinksForNode(to);
    };
    const onRestore = () => {
        setLinks(prevLinks => prevLinks.map(l => l.id === edge.id ? { ...l, deleted: false } : l));
        resetLinksForNode(from);
        resetLinksForNode(to);
    };
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
                            {edge.is_deleted ? (
                                <Link
                                    method="PATCH"
                                    title="Restore"
                                    href={route('dashboard.edges.restore', edge.id)}
                                    onSuccess={onRestore}
                                    className="rounded-md bg-slate-600 w-6 h-6 mr-2 transition duration-150 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 p-0.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"  className="stroke-white"/>
                                    </svg>
                                </Link>
                            ) : (
                                <Link
                                    method="DELETE"
                                    title="Delete"
                                    href={route('dashboard.edges.destroy', edge.id)}
                                    onSuccess={onDelete}
                                    className="rounded-md bg-slate-600 w-6 h-6 mr-2 transition duration-150 ease-in-out hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 p-0.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" className="stroke-white" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                        <div className={`dark:text-white text-xl inline break-words ${edge.is_deleted ? "line-through" : ""}`}>
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