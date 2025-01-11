import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextAreaInput from '@/Components/TextAreaInput';
import { Transition } from '@headlessui/react';
import GraphDetailsLayout from '@/Layouts/GraphDetailsLayout';
import GraphLayout from '@/Layouts/GraphLayout';
import { useGraph } from '@/Context/GraphContext';

function Tag({ tag, }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: tag.name,
        description: tag.description,
    });
    
    const { setTags } = useGraph();

    const submit = (e) => {
        e.preventDefault();
        setTags(prevTags =>
            prevTags.map(t => t.id === tag.id ? { ...t, ...data } : t)
        );
        patch(route('dashboard.tags.update', tag.id));
    }

    const preventSubmitOnEnter = (e) => {
        if (e.key === 'Enter') e.preventDefault();
    };

    return (
        <div>
            <Head title={`Edit: ${tag.name}`} />

            <form
                onSubmit={submit}
                className="flex flex-row-reverse"
                onKeyDownCapture={preventSubmitOnEnter}>

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
                        Edit Tag {tag.id}
                    </div>
                    <div className="flex flex-col w-full space-y-6 mt-5">
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                className="block w-full font-bold"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                isFocused
                                autoComplete="off" />
                            <InputError className="mt-2" message={errors.name} />
                        </div>
                        <div>
                            <InputLabel htmlFor="description" value="Description" />
                            <TextAreaInput
                                rows={8}
                                id="description"
                                className="block w-full"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                autoComplete="off" />
                            <InputError className="mt-2" message={errors.description} />
                        </div>
                    </div>
                </div>
            </form>
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