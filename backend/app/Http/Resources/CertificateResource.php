<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'verification_code' => $this->verification_code,
            'verification_url'  => $this->getVerificationUrl(),
            'issued_at'         => $this->issued_at?->toISOString(),
            'issued_at_human'   => $this->issued_at?->toDateString(),
            'expires_at'        => $this->expires_at?->toISOString(),
            'is_valid'          => $this->isValid(),
            'final_score'       => $this->final_score ? (float) $this->final_score : null,
            'pdf_url'           => $this->pdf_url,
            'metadata'          => $this->metadata,
            'course'            => $this->whenLoaded('course', fn() => [
                'id'             => $this->course->id,
                'title'          => $this->course->title,
                'thumbnail'      => $this->course->thumbnail,
                'duration_hours' => $this->course->duration_hours,
                'instructor'     => $this->course->relationLoaded('instructor') ? [
                    'name' => $this->course->instructor->name,
                ] : null,
            ]),
            'user'              => $this->whenLoaded('user', fn() => [
                'id'   => $this->user->id,
                'name' => $this->user->name,
            ]),
        ];
    }
}
