<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->role !== 'admin') {
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                abort(403);
            }

            return redirect('/');
        }

        return $next($request);
    }
}
