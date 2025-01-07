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
        $edges = Edge::query()->get();

        return response()->json($edges);
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
        $from = $edge->origin;
        $to = $edge->target;

        return inertia(
            'Edge/Show',
            compact('edge', 'from', 'to'),
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Edge $edge)
    {
        $from = $edge->origin;
        $to = $edge->target;

        return inertia(
            'Edge/Edit',
            compact('edge', 'from', 'to'),
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
