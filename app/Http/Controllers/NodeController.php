<?php

namespace App\Http\Controllers;

use App\Models\Node;
use App\Http\Requests\StoreNodeRequest;
use App\Http\Requests\UpdateNodeRequest;
use App\Models\Edge;
use App\Models\Tag;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class NodeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $nodes = Node::query()->with('tags')->get();
        return response()->json($nodes);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia(
            'Node/Create',
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNodeRequest $request)
    {
        $data = $request->validated();
        $node = Node::create($data);
        if ($request->has('tags')) {
            $node->tags()->sync($request->input('tags'));
        }
        return to_route('dashboard.nodes.show', $node->id)
            ->with('success', 'Node created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Node $node)
    {
        $node['tags'] = $node->tags;
        return inertia(
            'Node/Show',
            compact('node'),
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Node $node)
    {
        $node['tags'] = $node->tags;
        return inertia(
            'Node/Edit',
            compact('node'),
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNodeRequest $request, Node $node)
    {
        $node->update($request->validated());
        if ($request->has('tags')) {
            $node->tags()->sync($request->input('tags'));
        }

        return to_route('dashboard.nodes.show', $node->id)
            ->with('success', 'Node updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Node $node)
    {
        $node->is_deleted = true;
        $node->save();
        
        return to_route('dashboard')
            ->with('success', 'Node deleted successfully');
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore(Node $node)
    {
        $node->is_deleted = false;
        $node->save();
        
        return to_route('dashboard.nodes.show', $node->id)
            ->with('success', 'Node restored successfully');
    }
}
