import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextAreaInput from '@/Components/TextAreaInput';
import { Button, Transition } from '@headlessui/react';
import PrimaryButton from '@/Components/PrimaryButton';
import Layout from './Layout';


function Node({ node, }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            title: node.title,
            full_name: node.full_name,
            description: node.description,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('dashboard.nodes.update', node.id));
    }

    return (
        <div>
            <Head title={`Edit: ${node.title}`} />

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
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Saved.
                                </p>
                            </Transition>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <div className="w-full break-words dark:text-white text-xl">
                        Edit Node {node.id}
                    </div>
                    <div className="flex flex-col w-full space-y-6 mt-5">
                        <div>
                            <InputLabel htmlFor="title" value="Title" />
                            <TextInput
                                id="title"
                                className="block w-full font-bold"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                                isFocused
                                autoComplete="off" />

                            <InputError className="mt-2" message={errors.title} />
                        </div>
                        <div>
                            <InputLabel htmlFor="full_name" value="Full Name" />
                            <TextInput
                                id="full_name"
                                className="block w-full"
                                value={data.full_name}
                                onChange={(e) => setData('full_name', e.target.value)}
                                required
                                autoComplete="off" />

                            <InputError className="mt-2" message={errors.full_name} />
                        </div>
                        <div>
                            <InputLabel htmlFor="description" value="Description" />
                            <TextAreaInput
                                rows={8}
                                id="description"
                                className="block w-full"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                required
                                autoComplete="off" />

                            <InputError className="mt-2" message={errors.description} />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

Node.layout = (page) => <Layout children={page} />

export default Node;