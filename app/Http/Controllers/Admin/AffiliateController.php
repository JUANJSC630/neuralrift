<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Affiliate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AffiliateController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Affiliate::withCount('clicks');

        match ($request->input('sort')) {
            'name_asc'  => $query->orderBy('name'),
            'name_desc' => $query->orderByDesc('name'),
            'date_asc'  => $query->orderBy('created_at'),
            'date_desc' => $query->orderByDesc('created_at'),
            default     => $query->orderByDesc('created_at'),
        };

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->input('status') === 'active') {
            $query->where('active', true);
        } elseif ($request->input('status') === 'inactive') {
            $query->where('active', false);
        } elseif ($request->input('status') === 'featured') {
            $query->where('featured', true);
        }

        return Inertia::render('Admin/Affiliates/Index', [
            'affiliates' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only('search', 'status', 'sort'),
            'totals' => [
                'all' => Affiliate::count(),
                'active' => Affiliate::where('active', true)->count(),
                'inactive' => Affiliate::where('active', false)->count(),
                'featured' => Affiliate::where('featured', true)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return $this->index(new Request);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'url' => 'nullable|url',
            'website' => 'nullable|url',
            'description' => 'nullable|string',
            'description_en' => 'nullable|string',
            'commission' => 'nullable|string|max:100',
            'commission_type' => 'required|in:recurring,one_time,percentage',
            'commission_value' => 'nullable|numeric',
            'cookie_duration' => 'nullable|string|max:50',
            'pros' => 'nullable|array',
            'cons' => 'nullable|array',
            'rating' => 'nullable|numeric|min:1|max:5',
            'category' => 'nullable|string|max:50',
            'badge' => 'nullable|string|max:50',
            'active' => 'boolean',
            'featured' => 'boolean',
            'order' => 'integer',
        ]);

        Affiliate::create($validated);

        return back()->with('success', 'Afiliado creado.');
    }

    public function show(Affiliate $affiliate): Response
    {
        return $this->index(new Request);
    }

    public function edit(Affiliate $affiliate): Response
    {
        return $this->index(new Request);
    }

    public function update(Request $request, Affiliate $affiliate): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'url' => 'nullable|url',
            'website' => 'nullable|url',
            'description' => 'nullable|string',
            'commission' => 'nullable|string|max:100',
            'commission_type' => 'required|in:recurring,one_time,percentage',
            'commission_value' => 'nullable|numeric',
            'cookie_duration' => 'nullable|string|max:50',
            'pros' => 'nullable|array',
            'cons' => 'nullable|array',
            'rating' => 'nullable|numeric|min:1|max:5',
            'category' => 'nullable|string|max:50',
            'badge' => 'nullable|string|max:50',
            'active' => 'boolean',
            'featured' => 'boolean',
            'order' => 'integer',
        ]);

        $affiliate->update($validated);

        return back()->with('success', 'Afiliado actualizado.');
    }

    public function destroy(Affiliate $affiliate): RedirectResponse
    {
        $affiliate->delete();

        return back()->with('success', 'Afiliado eliminado.');
    }
}
