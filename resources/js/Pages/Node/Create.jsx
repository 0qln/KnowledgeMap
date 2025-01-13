import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextAreaInput from '@/Components/TextAreaInput';
import { Button, Transition } from '@headlessui/react';
import GraphDetailsLayout from '@/Layouts/GraphDetailsLayout';
import GraphLayout from '@/Layouts/GraphLayout';
import { useMemo, useState } from 'react';
import { useGraph } from "@/Hooks/useGraph";
import fuzzysort from 'fuzzysort';

function Node({ }) {
    const { tags } = useGraph();
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        title: "",
        full_name: "",
        description: "",
        tags: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('dashboard.nodes.store'));
    }

    const preventSubmitOnEnter = (e) => {
        if (e.key === 'Enter') e.preventDefault();
    };

    return (
        <div>
            <Head title="Create Node" />

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
                        Create New Node
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
                                autoComplete="off" />
                            <InputError className="mt-2" message={errors.description} />
                        </div>
                        <TagList
                            allTags={tags}
                            data={data}
                            setData={setData} />
                    </div>
                </div>
            </form>
        </div>
    );
}

function TagList({ allTags, data, setData }) {
    const [nodeTags, setNodeTags] = useState([]);
    const [tagQueryLimit, setTagQueryLimit] = useState(10);
    const [tagsQuery, setTagsQuery] = useState("");

    const availableTags = useMemo(() =>
        allTags.filter(tag => !nodeTags.some(t => t.id === tag.id)),
        [nodeTags]);
    
    console.log(tagsQuery);

    const sortedTags = useMemo(() => (fuzzysort
        .go(tagsQuery, availableTags, {
            limit: tagQueryLimit + 1,
            key: 'name'
        })
        .map(r => r.obj)
    ), [tagsQuery, availableTags, tagQueryLimit]);
    
    console.log(sortedTags)

    const addTag = (tag) => {
        setNodeTags(prev => [...prev, tag]);
        setData("tags", [...data['tags'], tag.id]);
    };

    const removeTag = (tag) => {
        setNodeTags(prev => prev.filter(t => t.id !== tag.id));
        setData("tags", data['tags'].filter((id) => id !== tag.id));
    };

    const addFirstTag = (tags) => {
        tags.length && addTag(tags[0])
    };

    return (
        <div className="dark:text-gray-200">
            <InputLabel>Tags</InputLabel>
            <div className="flex flex-wrap text-sm break-words">
                {nodeTags.map(tag => (
                    <div
                        href={route('dashboard.tags', tag.id)}
                        key={tag.id}
                        className="items-center m-1 text-white bg-gray-700 p-1 px-2 rounded-md transition duration-150 ease-in-out hover:bg-gray-600 flex flex-row space-x-1">
                        {tag.name}
                        <Button
                            onClick={() => removeTag(tag)}
                            className="rounded-md w-6 h-6 ml-1 transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 p-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" className="stroke-white" />
                            </svg>
                        </Button>
                    </div>
                ))}
                <Button
                    onClick={() => addFirstTag(sortedTags)}
                    className="items-center m-1 text-white bg-gray-700 p-1 px-2 rounded-md transition duration-150 ease-in-out hover:bg-gray-600 flex flex-row space-x-1">
                    <TextInput
                        placeholder="add a tag"
                        onKeyDown={e => e.key === 'Enter' && addFirstTag(sortedTags)}
                        onChange={e => setTagsQuery(e.target.value)}
                        size="10"
                        className="py-0 flex flex-shrink" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" className="stroke=white" />
                    </svg>
                </Button>
                <div className="w-full" />
                <div className="m-2">
                    Available tags:
                </div>
                <div className="flex flex-row flex-wrap items-center">
                    {sortedTags
                        .slice(0, tagQueryLimit)
                        .map(tag => (
                            <Button
                                onClick={() => addTag(tag)}
                                className="items-center m-1 text-white bg-gray-700 p-1 px-2 rounded-md transition duration-150 ease-in-out hover:bg-gray-600 flex flex-row space-x-1"
                                key={tag.id}>
                                {tag.name}
                            </Button>
                        ))}
                    {sortedTags.length > tagQueryLimit && (
                        <div className="m-1 items-center flex flex-row">
                            <svg viewBox="0 0 32 24" xmlns="http://www.w3.org/2000/svg" className="size-6 fill-gray-500">
                                <circle r="4" cx="4" cy="12" />
                                <circle r="4" cx="16" cy="12" />
                                <circle r="4" cx="28" cy="12" />
                            </svg>
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