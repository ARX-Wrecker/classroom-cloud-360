<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'title'               => $this->title,
            'slug'                => $this->slug,
            'description'         => $this->description,
            'short_description'   => $this->short_description,
            'thumbnail'           => $this->thumbnail,
            'preview_video'       => $this->preview_video,
            'price'               => (float) $this->price,
            'is_free'             => $this->is_free,
            'is_published'        => $this->is_published,
            'published_at'        => $this->published_at?->toISOString(),
            'level'               => $this->level,
            'language'            => $this->language,
            'duration_hours'      => (float) $this->duration_hours,
            'total_lessons'       => $this->total_lessons,
            'requirements'        => $this->requirements ?? [],
            'what_you_learn'      => $this->what_you_learn ?? [],
            'tags'                => $this->tags ?? [],
            'certificate_enabled' => $this->certificate_enabled,
            'max_students'        => $this->max_students,
            'rating'              => (float) $this->rating,
            'rating_count'        => $this->rating_count,
            'enrolled_count'      => $this->enrolled_count,
            'created_at'          => $this->created_at?->toISOString(),
            'updated_at'          => $this->updated_at?->toISOString(),
            'instructor'          => $this->whenLoaded('instructor', fn() => [
                'id'     => $this->instructor->id,
                'name'   => $this->instructor->name,
                'avatar' => $this->instructor->avatar,
                'bio'    => $this->instructor->bio,
            ]),
            'category'            => $this->whenLoaded('category', fn() => [
                'id'    => $this->category->id,
                'name'  => $this->category->name,
                'slug'  => $this->category->slug,
                'icon'  => $this->category->icon,
                'color' => $this->category->color,
            ]),
            'modules'             => $this->whenLoaded('modules', fn() => ModuleResource::collection($this->modules)),
        ];
    }
}
