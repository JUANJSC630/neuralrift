<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class NewsletterController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Subscriber::latest();

        if ($request->has('confirmed') && $request->confirmed !== '') {
            $query->where('confirmed', $request->boolean('confirmed'));
        }
        if ($request->search) {
            $query->where('email', 'like', "%{$request->search}%");
        }

        return Inertia::render('Admin/Newsletter', [
            'subscribers' => $query->paginate(20)->withQueryString(),
            'totals'      => [
                'all'       => Subscriber::count(),
                'confirmed' => Subscriber::confirmed()->count(),
                'pending'   => Subscriber::where('confirmed', false)->count(),
                'es'        => Subscriber::confirmed()->where('lang', 'es')->count(),
                'en'        => Subscriber::confirmed()->where('lang', 'en')->count(),
            ],
            'filters' => $request->only(['confirmed', 'search']),
        ]);
    }

    public function destroy(Subscriber $subscriber): RedirectResponse
    {
        $subscriber->delete();
        return back()->with('success', 'Suscriptor eliminado.');
    }

    public function export(): StreamedResponse
    {
        $filename = 'neuralrift-subscribers-' . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Email', 'Nombre', 'Idioma', 'Confirmado', 'Fecha suscripción', 'Fecha confirmación']);

            Subscriber::orderBy('created_at', 'desc')
                ->cursor()
                ->each(function (Subscriber $sub) use ($handle) {
                    fputcsv($handle, [
                        $sub->email,
                        $sub->name ?? '',
                        $sub->lang,
                        $sub->confirmed ? 'Sí' : 'No',
                        $sub->created_at->format('Y-m-d H:i'),
                        $sub->confirmed_at?->format('Y-m-d H:i') ?? '',
                    ]);
                });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
