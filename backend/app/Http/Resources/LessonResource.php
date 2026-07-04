<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'module_id'        => $this->module_id,
            'title'            => $this->title,
            'content'          => $this->content,
            'video_url'        => $this->video_url,
            'video_duration'   => $this->video_duration,
            'duration_seconds' => $this->duration_seconds,
            'order'            => $this->order,
            'type'             => $this->type,
            'is_published'     => $this->is_published,
            'is_preview'       => $this->is_preview,
            'attachments'      => $this->attachments ?? [],
            'has_transcript'   => !empty($this->transcript),
            'created_at'       => $this->created_at?->toISOString(),
            'updated_at'       => $this->updated_at?->toISOString(),
        ];
    }
}
