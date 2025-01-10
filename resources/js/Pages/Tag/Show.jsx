import GraphDetailsLayout from "@/Layouts/GraphDetailsLayout";
import GraphLayout from "@/Layouts/GraphLayout";
import { Head, Link } from "@inertiajs/react";


const Tag = ({ tag }) => {
    console.log(tag)
    return (
        <div>
            <Head title={`${tag.title}`} />

            <div className="flex flex-row-reverse flex-between">

                <div className="flex flex-col w-full space-y-3">
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
                                href={route('dashboard.tags.edit', tag.id)}
                                className="rounded-md bg-slate-600 w-6 h-6 mr-2 transition duration-150 ease-in-out hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-4 -4 29 29" strokeWidth={1.5} stroke="currentColor" className="size-6 p-0.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" className="stroke-white" />
                                </svg>
                            </Link>
                        </div>
                        <div className="dark:text-white text-xl inline break-words">
                            {tag.name}
                        </div>
                    </div>
                    <div className="dark:text-gray-400 text-sm italic w-full">
                        [#{tag.id}] {tag.name}
                    </div>
                    <br />
                    <div className="dark:text-gray-200 text-sm break-words w-full">
                        {tag.description}
                    </div>
                    <br />
                    <div className="flex flex-row dark:text-gray-200 items-center">
                        <div className="flex-grow border-t-[1px] mx-2 dark:border-gray-400" />
                        <div>Nodes</div>
                        <div className="flex-grow border-t-[1px] mx-2 dark:border-gray-400" />
                    </div>
                    {tag.nodes && (
                        <div className="flex flex-wrap text-sm break-words">
                            {tag.nodes.map(node => (
                                <Link
                                    href={route('dashboard.nodes.show', node.id)}
                                    key={node.id}
                                    className="items-center m-1 text-white bg-gray-700 py-1 px-2 rounded-md transition duration-150 ease-in-out hover:bg-gray-600 flex flex-row space-x-1">
                                    {node.title}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Tag.layout = (page) =>
(<GraphLayout childrenRight={
    <GraphDetailsLayout children={
        page
    } />
} />
);

export default Tag;