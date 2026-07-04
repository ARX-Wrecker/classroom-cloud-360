<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'email'             => $this->email,
            'role'              => $this->role,
            'avatar'            => $this->avatar,
            'bio'               => $this->bio,
            'phone'             => $this->phone,
            'is_active'         => $this->is_active,
            'two_factor_enabled' => $this->two_factor_enabled,
            'timezone'          => $this->timezone,
            'language'          => $this->language,
            'country'           => $this->country,
            'last_login_at'     => $this->last_login_at?->toISOString(),
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'created_at'        => $this->created_at?->toISOString(),
            'tenant'            => $this->whenLoaded('tenant', fn() => [
                'id'   => $this->tenant->id,
                'name' => $this->tenant->name,
                'slug' => $this->tenant->slug,
            ]),
            'stats'             => $this->when(
                $this->relationLoaded('enrollments') || $this->relationLoaded('courses'),
                fn() => [
                    'enrolled_courses'  => $this->whenLoaded('enrollments', fn() => $this->enrollments->count()),
                    'created_courses'   => $this->whenLoaded('courses', fn() => $this->courses->count()),
                    'certificates'      => $this->whenLoaded('certificates', fn() => $this->certificates->count()),
                ]
            ),
        ];
    }
}
