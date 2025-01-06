<?php

namespace App\Http\Controllers;

use App\Models\Edge;
use App\Http\Requests\StoreEdgeRequest;
use App\Http\Requests\UpdateEdgeRequest;
use App\Models\Node;
use App\Models\Tag;

class EdgeController extends Controller
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
    public function store(StoreEdgeRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Edge $edge)
    {
        $edges = Edge::query()->get();
        $tags = Tag::query()->get();
        $nodes = Node::query()->get();
        $nodeHasTag = $nodeHasTag = $nodes->mapWithKeys(function (Node $node) {
            return [$node->id => $node->tags->pluck('id')->toArray()];
        });

        $from = $edge->origin;
        $to = $edge->target;

        return inertia(
            'Edge/Show',
            compact('edge', 'from', 'to', 'nodes', 'edges', 'tags', 'nodeHasTag'),
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Edge $edge)
    {
        $nodes = Node::query()->get();
        $nodeHasTag = $nodeHasTag = $nodes->mapWithKeys(function (Node $n) {
            return [$n->id => $n->tags->pluck('id')->toArray()];
        });
        $edges = Edge::query()->get();
        $tags = Tag::query()->get();

        $from = $edge->origin;
        $to = $edge->target;

        return inertia(
            'Edge/Edit',
            compact('edge', 'from', 'to', 'nodes', 'edges', 'tags', 'nodeHasTag'),
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEdgeRequest $request, Edge $edge)
    {
        $edge->update($request->validated());

        return to_route('dashboard.edges.show', $edge->id)
            ->with('success', 'Edge updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Edge $edge)
    {
        //
    }
}
