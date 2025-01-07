<?php

namespace App\Http\Controllers;

use App\Models\Edge;
use App\Models\Node;
use App\Models\Tag;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $nodes = Node::query()->with('tags')->get();
        $edges = Edge::query()->get();
        $tags = Tag::query()->get();

        return inertia(
            'Dashboard',
            compact('nodes', 'edges', 'tags'),
        );
    }
}
