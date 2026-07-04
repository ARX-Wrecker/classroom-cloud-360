<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModuleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'course_id'      => $this->course_id,
            'title'          => $this->title,
            'description'    => $this->description,
            'order'          => $this->order,
            'is_published'   => $this->is_published,
            'duration_hours' => (float) $this->duration_hours,
            'lessons_count'  => $this->whenLoaded('lessons', fn() => $this->lessons->count()),
            'lessons'        => $this->whenLoaded('lessons', fn() => LessonResource::collection($this->lessons)),
            'created_at'     => $this->created_at?->toISOString(),
            'updated_at'     => $this->updated_at?->toISOString(),
        ];
    }
}
