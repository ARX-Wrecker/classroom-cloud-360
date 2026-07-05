<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    private const ALLOWED_PROVIDERS = ['google', 'azure'];

    public function redirect(string $provider)
    {
        abort_unless(in_array($provider, self::ALLOWED_PROVIDERS), 400, 'Proveedor no soportado');

        return Socialite::driver($provider)->stateless()->redirect();
    }

    public function callback(string $provider)
    {
        abort_unless(in_array($provider, self::ALLOWED_PROVIDERS), 400, 'Proveedor no soportado');

        $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3001'));

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            return redirect("{$frontendUrl}/login?error=oauth_failed");
        }

        $providerField = $provider === 'azure' ? 'microsoft_id' : 'google_id';

        $user = User::where($providerField, $socialUser->getId())
            ->orWhere('email', $socialUser->getEmail())
            ->first();

        if ($user) {
            $user->update([$providerField => $socialUser->getId()]);
        } else {
            $nameParts = explode(' ', $socialUser->getName() ?? '', 2);
            $user = User::create([
                'name'          => $socialUser->getName() ?? 'Usuario',
                'email'         => $socialUser->getEmail(),
                $providerField  => $socialUser->getId(),
                'avatar'        => $socialUser->getAvatar(),
                'password'      => bcrypt(Str::random(32)),
                'role'          => 'student',
                'is_active'     => true,
                'email_verified_at' => now(),
            ]);
        }

        $token = $user->createToken('oauth-token')->plainTextToken;

        return redirect("{$frontendUrl}/oauth/callback?token={$token}&name=" . urlencode($user->name));
    }
}
