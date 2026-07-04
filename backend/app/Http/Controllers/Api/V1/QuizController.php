<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuizResource;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Quiz;
use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class QuizController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user  = $request->user();
            $query = Quiz::with(['course', 'module', 'questions']);

            if ($user->isInstructor()) {
                $query->whereHas('course', fn($q) => $q->where('instructor_id', $user->id));
            }

            if ($request->filled('course_id')) {
                $query->where('course_id', $request->course_id);
            }

            $quizzes = $query->orderBy('created_at', 'desc')->paginate(15);

            return response()->json([
                'success' => true,
                'message' => 'Listado de quizzes.',
                'data'    => QuizResource::collection($quizzes),
                'meta'    => [
                    'current_page' => $quizzes->currentPage(),
                    'last_page'    => $quizzes->lastPage(),
                    'total'        => $quizzes->total(),
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los quizzes.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'course_id'           => 'required|exists:courses,id',
            'module_id'           => 'sometimes|nullable|exists:modules,id',
            'title'               => 'required|string|max:255',
            'description'         => 'sometimes|string',
            'time_limit'          => 'sometimes|nullable|integer|min:1',
            'passing_score'       => 'sometimes|numeric|min:0|max:100',
            'max_attempts'        => 'sometimes|nullable|integer|min:1',
            'randomize_questions' => 'sometimes|boolean',
            'show_answers'        => 'sometimes|boolean',
            'questions'           => 'sometimes|array',
            'questions.*.type'           => 'required_with:questions|in:multiple_choice,true_false,open,fill_blank',
            'questions.*.question'       => 'required_with:questions|string',
            'questions.*.options'        => 'sometimes|array',
            'questions.*.correct_answer' => 'required_with:questions',
            'questions.*.points'         => 'sometimes|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            $data = $validator->validated();
            $questionsData = $data['questions'] ?? [];
            unset($data['questions']);

            $quiz = Quiz::create($data);

            foreach ($questionsData as $index => $qData) {
                $quiz->questions()->create(array_merge($qData, ['order' => $index + 1]));
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Quiz creado exitosamente.',
                'data'    => new QuizResource($quiz->load('questions')),
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el quiz.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $quiz = Quiz::with(['course', 'module', 'questions'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Detalle del quiz.',
                'data'    => new QuizResource($quiz),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz no encontrado.',
                'error'   => $e->getMessage(),
            ], 404);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title'               => 'sometimes|string|max:255',
            'description'         => 'sometimes|string',
            'time_limit'          => 'sometimes|nullable|integer|min:1',
            'passing_score'       => 'sometimes|numeric|min:0|max:100',
            'max_attempts'        => 'sometimes|nullable|integer|min:1',
            'randomize_questions' => 'sometimes|boolean',
            'show_answers'        => 'sometimes|boolean',
            'is_published'        => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $quiz = Quiz::findOrFail($id);
            $quiz->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Quiz actualizado correctamente.',
                'data'    => new QuizResource($quiz->fresh('questions')),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el quiz.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $quiz = Quiz::findOrFail($id);
            $quiz->delete();

            return response()->json([
                'success' => true,
                'message' => 'Quiz eliminado correctamente.',
                'data'    => null,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el quiz.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function submit(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'answers'    => 'required|array',
            'time_spent' => 'sometimes|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $quiz = Quiz::with('questions')->findOrFail($id);
            $user = $request->user();

            // Check enrollment
            $enrollment = Enrollment::where('user_id', $user->id)
                ->where('course_id', $quiz->course_id)
                ->firstOrFail();

            if (!$quiz->canAttempt($user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => "Has alcanzado el número máximo de intentos ({$quiz->max_attempts}).",
                ], 422);
            }

            $answers    = $request->answers;
            $totalScore = 0;
            $maxScore   = 0;
            $results    = [];

            foreach ($quiz->questions as $question) {
                $maxScore += $question->points;
                $userAnswer = $answers[$question->id] ?? null;
                $isCorrect  = $question->checkAnswer($userAnswer);

                if ($isCorrect) {
                    $totalScore += $question->points;
                }

                $results[$question->id] = [
                    'correct'        => $isCorrect,
                    'user_answer'    => $userAnswer,
                    'correct_answer' => $quiz->show_answers ? $question->getAttributes()['correct_answer'] : null,
                    'explanation'    => $quiz->show_answers ? $question->explanation : null,
                    'points_earned'  => $isCorrect ? $question->points : 0,
                ];
            }

            $scorePercent   = $maxScore > 0 ? ($totalScore / $maxScore) * 100 : 0;
            $passed         = $scorePercent >= $quiz->passing_score;
            $attemptNumber  = $quiz->getUserAttempts($user->id) + 1;

            DB::beginTransaction();

            $submission = Submission::create([
                'user_id'        => $user->id,
                'enrollment_id'  => $enrollment->id,
                'quiz_id'        => $quiz->id,
                'type'           => Submission::TYPE_QUIZ,
                'answers'        => $answers,
                'score'          => $totalScore,
                'max_score'      => $maxScore,
                'passed'         => $passed,
                'time_spent'     => $request->time_spent ?? 0,
                'status'         => Submission::STATUS_GRADED,
                'graded_at'      => now(),
                'attempt_number' => $attemptNumber,
            ]);

            Grade::create([
                'user_id'       => $user->id,
                'enrollment_id' => $enrollment->id,
                'submission_id' => $submission->id,
                'quiz_id'       => $quiz->id,
                'score'         => $totalScore,
                'max_score'     => $maxScore,
                'letter_grade'  => $this->getLetterGrade($scorePercent),
                'graded_at'     => now(),
                'is_final'      => true,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $passed ? '¡Aprobaste el quiz!' : 'No aprobaste el quiz. Puedes intentarlo de nuevo.',
                'data'    => [
                    'submission_id'  => $submission->id,
                    'score'          => $totalScore,
                    'max_score'      => $maxScore,
                    'score_percent'  => round($scorePercent, 2),
                    'passing_score'  => $quiz->passing_score,
                    'passed'         => $passed,
                    'attempt_number' => $attemptNumber,
                    'results'        => $results,
                ],
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar las respuestas.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    private function getLetterGrade(float $percent): string
    {
        return match (true) {
            $percent >= 90 => 'A',
            $percent >= 80 => 'B',
            $percent >= 70 => 'C',
            $percent >= 60 => 'D',
            default        => 'F',
        };
    }
}
