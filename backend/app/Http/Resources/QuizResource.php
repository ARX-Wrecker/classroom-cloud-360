<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'course_id'           => $this->course_id,
            'module_id'           => $this->module_id,
            'lesson_id'           => $this->lesson_id,
            'title'               => $this->title,
            'description'         => $this->description,
            'time_limit'          => $this->time_limit,
            'passing_score'       => (float) $this->passing_score,
            'max_attempts'        => $this->max_attempts,
            'randomize_questions' => $this->randomize_questions,
            'show_answers'        => $this->show_answers,
            'is_published'        => $this->is_published,
            'questions_count'     => $this->whenLoaded('questions', fn() => $this->questions->count()),
            'questions'           => $this->whenLoaded('questions', fn() => $this->questions->map(fn($q) => [
                'id'       => $q->id,
                'type'     => $q->type,
                'question' => $q->question,
                'options'  => $q->options,
                'points'   => (float) $q->points,
                'order'    => $q->order,
                'media_url' => $q->media_url,
                // correct_answer is hidden in Question model
            ])),
            'course'              => $this->whenLoaded('course', fn() => [
                'id'    => $this->course->id,
                'title' => $this->course->title,
            ]),
            'created_at'          => $this->created_at?->toISOString(),
        ];
    }
}
