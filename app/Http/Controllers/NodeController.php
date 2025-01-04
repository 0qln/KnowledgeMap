<?php

namespace App\Http\Controllers;

use App\Models\Node;
use App\Http\Requests\StoreNodeRequest;
use App\Http\Requests\UpdateNodeRequest;
use App\Models\Edge;
use App\Models\Tag;
use Inertia\Inertia;

class NodeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNodeRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Node $id)
    {
        $nodes = Node::query()->get();
        $nodeHasTag = $nodeHasTag = $nodes->mapWithKeys(function (Node $node) {
            return [$node->id => $node->tags->pluck('id')->toArray()];
        });

        $edges = Edge::query()->get();

        $tags = Tag::query()->get();
        
        $node = Node::find($id)->first();

        return inertia(
            'Node/Show',
            compact('node', 'nodes', 'edges', 'tags', 'nodeHasTag'),
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Node $node)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNodeRequest $request, Node $node)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Node $node)
    {
        //
    }
}
