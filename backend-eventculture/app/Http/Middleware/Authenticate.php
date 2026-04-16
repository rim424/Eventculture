<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        // Pour les requêtes API, on ne redirige pas vers login
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }
        
        return route('login');
    }
}