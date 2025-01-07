import { Head, Link, useForm } from '@inertiajs/react';
import GraphLayout from '@/Layouts/BaseLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextAreaInput from '@/Components/TextAreaInput';
import { Transition } from '@headlessui/react';
import GraphDetailsLayout from '@/Layouts/GraphDetailsLayout';

function Edge({ edge, from, to, }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            description: edge.description, 
            weight: edge.weight,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('dashboard.edges.update', edge.id));
    }

    return (
        <div>
            <Head title={`Edit: Edge ${edge.id}`} />

            <form onSubmit={submit} className="flex flex-row-reverse">

                <div className="flex flex-col ml-2 justify-between">
                    <div className="flex flex-col">
                        <Link
                            href={route('dashboard')}
                            className="rounded-md w-6 h-6 transition duration-150 ease-in-out hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" className="stroke-white" />
                            </svg>
                        </Link>
                    </div>
                    <div className="flex flex-col">
                        <div>
                            <button disabled={processing} title="Save"
                                className="rounded-md w-6 h-6 transition duration-150 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" className="stroke-white" />
                                </svg>
                            </button>
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Saved.
                                </p>
                            </Transition>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <div className="w-full break-words dark:text-white text-xl">
                        Edit Edge {edge.id}
                    </div>
                    <div className="flex flex-col w-full space-y-6 mt-5">
                        <div className="flex flex-row space-x-2 flex-wrap">
                            <div className="dark:text-gray-200 text-sm break-words">
                                [{from.id}] {from.title}
                            </div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" className="stroke-white" />
                                </svg>
                            </div>
                            <div className="dark:text-gray-200 text-sm break-words">
                                [{to.id}] {to.title}
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="description" value="Description" />
                            <TextAreaInput
                                rows={4}
                                id="description"
                                className="block w-full"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                required
                                autoComplete="off" />

                            <InputError className="mt-2" message={errors.description} />
                        </div>
                        <div>
                            <InputLabel htmlFor="weight" value="Weight" />
                            <TextInput
                                id="weight"
                                className="block w-full"
                                value={data.weight}
                                onChange={(e) => setData('weight', e.target.value)}
                                required
                                autoComplete="off" />

                            <InputError className="mt-2" message={errors.weight} />
                        </div>
                    </div>
                </div>
            </form>
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