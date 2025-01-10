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
        return inertia('Dashboard');
    }
}
