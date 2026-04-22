<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Affiliate;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AffiliateController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Affiliates/Index', [
            'affiliates' => Affiliate::orderByDesc('featured')
                ->orderBy('order')
                ->withCount('clicks')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Affiliates/Index', [
            'affiliates' => Affiliate::orderByDesc('featured')->orderBy('order')->withCount('clicks')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:100',
            'url'              => 'required|url',
            'website'          => 'nullable|url',
            'description'      => 'nullable|string',
            'description_en'   => 'nullable|string',
            'commission'       => 'nullable|string|max:100',
            'commission_type'  => 'required|in:recurring,one_time,percentage',
            'commission_value' => 'nullable|numeric',
            'cookie_duration'  => 'nullable|string|max:50',
            'pros'             => 'nullable|array',
            'cons'             => 'nullable|array',
            'rating'           => 'nullable|numeric|min:1|max:5',
            'category'         => 'nullable|string|max:50',
            'badge'            => 'nullable|string|max:50',
            'active'           => 'boolean',
            'featured'         => 'boolean',
            'order'            => 'integer',
        ]);

        Affiliate::create($validated);
        return back()->with('success', 'Afiliado creado.');
    }

    public function show(Affiliate $affiliate): Response
    {
        return $this->index();
    }

    public function edit(Affiliate $affiliate): Response
    {
        return Inertia::render('Admin/Affiliates/Index', [
            'affiliates' => Affiliate::orderByDesc('featured')->orderBy('order')->withCount('clicks')->get(),
            'editing'    => $affiliate,
        ]);
    }

    public function update(Request $request, Affiliate $affiliate): RedirectResponse
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:100',
            'url'              => 'required|url',
            'website'          => 'nullable|url',
            'description'      => 'nullable|string',
            'commission'       => 'nullable|string|max:100',
            'commission_type'  => 'required|in:recurring,one_time,percentage',
            'commission_value' => 'nullable|numeric',
            'cookie_duration'  => 'nullable|string|max:50',
            'pros'             => 'nullable|array',
            'cons'             => 'nullable|array',
            'rating'           => 'nullable|numeric|min:1|max:5',
            'category'         => 'nullable|string|max:50',
            'badge'            => 'nullable|string|max:50',
            'active'           => 'boolean',
            'featured'         => 'boolean',
            'order'            => 'integer',
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
