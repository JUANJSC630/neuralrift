<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::withCount('posts')
                ->orderBy('order')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::withCount('posts')->orderBy('order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'name_en' => 'nullable|string|max:50',
            'description' => 'nullable|string|max:300',
            'description_en' => 'nullable|string|max:300',
            'color' => 'required|string|max:7',
            'icon' => 'nullable|string|max:10',
            'order' => 'integer',
        ]);

        Category::create($validated);

        return back()->with('success', 'Categoría creada.');
    }

    public function show(Category $category): Response
    {
        return $this->index();
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::withCount('posts')->orderBy('order')->get(),
            'editing' => $category,
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'name_en' => 'nullable|string|max:50',
            'description' => 'nullable|string|max:300',
            'description_en' => 'nullable|string|max:300',
            'color' => 'required|string|max:7',
            'icon' => 'nullable|string|max:10',
            'order' => 'integer',
        ]);

        $category->update($validated);

        return back()->with('success', 'Categoría actualizada.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return back()->with('success', 'Categoría eliminada.');
    }
}
