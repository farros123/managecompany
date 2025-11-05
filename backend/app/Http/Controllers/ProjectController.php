<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::all()->map(function ($project) {
            $project->img_url = $project->img
                ? asset('images/projects/' . $project->img)
                : null;
            return $project;
        });

        return response()->json($projects);
    }

   public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'budget' => 'required|numeric',
        'status' => 'required|string',
        'completion' => 'required|numeric',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
    ]);

    if ($request->hasFile('image')) {
        $filename = time() . '.' . $request->file('image')->getClientOriginalExtension();
        $request->file('image')->move(public_path('images/projects'), $filename);
        $image = $filename;
    } else {
        $image = null;
    }

    Project::create([
        'name' => $request->name,
        'budget' => $request->budget,
        'status' => $request->status,
        'completion' => $request->completion,
        'img' => $image,
    ]);

    return response()->json(['message' => 'Project created successfully']);
}


    public function show($id)
    {
        $project = Project::findOrFail($id);
        return response()->json($project);
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'budget' => 'nullable|numeric',
            'status' => 'nullable|string|max:100',
            'completion' => 'nullable|numeric|min:0|max:100',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($project->img && file_exists(public_path('images/projects/' . $project->img))) {
                unlink(public_path('images/projects/' . $project->img));
            }

            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images/projects'), $filename);
            $validated['img'] = $filename;
        }

        $project->update($validated);

        return response()->json([
            'message' => '✅ Project berhasil diperbarui!',
            'project' => $project,
        ]);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);

        if ($project->img && file_exists(public_path('images/projects/' . $project->img))) {
            unlink(public_path('images/projects/' . $project->img));
        }

        $project->delete();

        return response()->json(['message' => '✅ Project berhasil dihapus!']);
    }
}
