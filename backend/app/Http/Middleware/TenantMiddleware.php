<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantMiddleware
{
    /**
     * Resolve tenant from subdomain, header, or query param.
     * Sets app('tenant') for controllers to consume.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = null;

        // 1. Check X-Tenant-ID header
        if ($request->hasHeader('X-Tenant-ID')) {
            $tenant = Tenant::find($request->header('X-Tenant-ID'));
        }

        // 2. Check X-Tenant-Slug header
        if (!$tenant && $request->hasHeader('X-Tenant-Slug')) {
            $tenant = Tenant::where('slug', $request->header('X-Tenant-Slug'))->first();
        }

        // 3. Subdomain resolution
        if (!$tenant) {
            $host      = $request->getHost();
            $appDomain = parse_url(config('app.url'), PHP_URL_HOST);
            if ($host !== $appDomain && str_ends_with($host, '.' . $appDomain)) {
                $subdomain = str_replace('.' . $appDomain, '', $host);
                $tenant    = Tenant::where('slug', $subdomain)->first();
            }
        }

        // 4. Query param (useful for dev/testing)
        if (!$tenant && $request->filled('tenant')) {
            $tenant = Tenant::where('slug', $request->query('tenant'))->first();
        }

        if ($tenant) {
            if (!$tenant->isActive()) {
                return response()->json([
                    'success' => false,
                    'message' => 'El tenant está inactivo o su suscripción ha expirado.',
                    'data'    => null,
                ], 403);
            }
            app()->instance('tenant', $tenant);
            config(['app.tenant_id' => $tenant->id]);
        }

        return $next($request);
    }
}
