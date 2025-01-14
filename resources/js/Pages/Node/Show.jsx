import { Head, Link } from '@inertiajs/react';
import GraphDetailsLayout from '@/Layouts/GraphDetailsLayout';
import GraphLayout from '@/Layouts/GraphLayout';
import { useGraph } from '@/Hooks/useGraph';
import { nodeEq } from '@/Components/Graph';

function Node({ node }) {
    const { setNodes, resetLinksForNode } = useGraph();
    const onDelete = () => {
        setNodes(prevNodes => prevNodes.map(n => n.id === node.id ? { ...n, deleted: true } : n));
        resetLinksForNode(node);
    };
    const onRestore = () => {
        setNodes(prevNodes => prevNodes.map(n => n.id === node.id ? { ...n, deleted: false } : n));
        resetLinksForNode(node);
    };

    return (
        <div>
            <Head title={`${node.title}`} />

            <div className="flex flex-row-reverse flex-between min-w-80">

                <div className="flex flex-col w-full space-y-3">
                    <div className="">
                        <div className="float-right flex flex-row-reverse">
                            <Link
                                title="Back"
                                href={route('dashboard')}
                                className="rounded-md bg-slate-600 w-6 h-6 transition duration-150 ease-in-out hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 p-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" className="stroke-white" />
                                </svg>
                            </Link>
                            <Link
                                title="Edit"
                                href={route('dashboard.nodes.edit', node.id)}
                                className="rounded-md bg-slate-600 w-6 h-6 mr-2 transition duration-150 ease-in-out hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-4 -4 29 29" strokeWidth={1.5} stroke="currentColor" className="size-6 p-0.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" className="stroke-white" />
                                </svg>
                            </Link>
                            {node.is_deleted ? (
                                <Link
                                    method="PATCH"
                                    title="Restore"
                                    href={route('dashboard.nodes.restore', node.id)}
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
                                    href={route('dashboard.nodes.destroy', node.id)}
                                    onSuccess={onDelete}
                                    className="rounded-md bg-slate-600 w-6 h-6 mr-2 transition duration-150 ease-in-out hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 p-0.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" className="stroke-white" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                        <div className={`dark:text-white text-xl inline break-words ${node.is_deleted ? "line-through" : ""}`}>
                            {node.title}
                        </div>
                    </div>
                    <div className="dark:text-gray-400 text-sm italic w-full">
                        [#{node.id}] {node.full_name}
                    </div>
                    <br />
                    <div className="dark:text-gray-200 text-sm break-words w-full">
                        {node.description}
                    </div>
                    <br />
                    <div className="flex flex-row dark:text-gray-200 items-center">
                        <div className="flex-grow border-t-[1px] mx-2 dark:border-gray-400" />
                        <div>Tags</div>
                        <div className="flex-grow border-t-[1px] mx-2 dark:border-gray-400" />
                    </div>
                    {node.tags && (
                        <div className="flex flex-wrap text-sm break-words">
                            {node.tags.map(tag => (
                                <Link
                                    href={route('dashboard.tags.show', tag.id)}
                                    key={tag.id}
                                    className="items-center m-1 text-white bg-gray-700 py-1 px-2 rounded-md transition duration-150 ease-in-out hover:bg-gray-600 flex flex-row space-x-1">
                                    {tag.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Node.layout = (page) =>
(<GraphLayout childrenRight={
    <GraphDetailsLayout children={
        page
    } />
} />
);

export default Node;