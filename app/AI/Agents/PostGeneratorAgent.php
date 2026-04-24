<?php

namespace App\AI\Agents;

use App\AI\DTOs\GeneratedPostDTO;
use App\AI\Prompts\NewsPostPrompt;
use App\AI\Prompts\ReviewPostPrompt;
use App\AI\Prompts\TutorialPostPrompt;
use App\Models\Affiliate;
use App\Models\Category;
use Illuminate\Support\Facades\Log;
use Laravel\Ai\AnonymousAgent;

class PostGeneratorAgent
{
    private const MODEL = 'claude-sonnet-4-6';

    public function generate(array $inputs): GeneratedPostDTO
    {
        $prompt = $this->buildPrompt($inputs);
        $enrichedInputs = $this->enrichInputs($inputs);
        $fullPrompt = $prompt->build($enrichedInputs);

        Log::info('PostGeneratorAgent: starting generation', [
            'type' => $inputs['post_type'],
            'lang' => $inputs['lang'],
            'topic' => substr($inputs['topic'], 0, 100),
        ]);

        $agent = new AnonymousAgent(
            instructions: 'You are a professional blog post generator that outputs valid JSON only. Never include markdown formatting, backticks, or any text outside the JSON object.',
            messages: [],
            tools: [],
        );

        $response = $agent->prompt(
            prompt: $fullPrompt,
            provider: 'anthropic',
            model: self::MODEL,
            timeout: 300,  // 5 min — bilingual tutorials can take 3-4 min
        );

        $parsed = $this->parseResponse($response->text);
        $enriched = $this->enrichParsedData($parsed, $inputs);

        Log::info('PostGeneratorAgent: generation complete', [
            'title' => $enriched['title'] ?? 'unknown',
        ]);

        return GeneratedPostDTO::fromArray($enriched);
    }

    private function buildPrompt(array $inputs): object
    {
        return match ($inputs['post_type']) {
            'news' => new NewsPostPrompt,
            'tutorial' => new TutorialPostPrompt,
            'review' => new ReviewPostPrompt,
            default => new TutorialPostPrompt,
        };
    }

    private function enrichInputs(array $inputs): array
    {
        if (! empty($inputs['category_id'])) {
            $category = Category::find($inputs['category_id']);
            $inputs['category_name'] = $category->name ?? '';
        }

        if (! empty($inputs['affiliate_id'])) {
            $affiliate = Affiliate::find($inputs['affiliate_id']);
            $inputs['affiliate_name'] = $affiliate->name ?? '';
        }

        return $inputs;
    }

    private function parseResponse(string $response): array
    {
        $cleaned = preg_replace('/^```json\s*/m', '', $response);
        $cleaned = preg_replace('/^```\s*/m', '', $cleaned);
        $cleaned = trim($cleaned);

        $decoded = json_decode($cleaned, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error('PostGeneratorAgent: JSON parse error', [
                'error' => json_last_error_msg(),
                'response' => substr($response, 0, 500),
            ]);

            throw new \RuntimeException(
                'La IA devolvió una respuesta inválida. Intenta de nuevo. Error: '.json_last_error_msg()
            );
        }

        return $decoded;
    }

    private function enrichParsedData(array $parsed, array $inputs): array
    {
        if (isset($parsed['content_json']) && is_array($parsed['content_json'])) {
            $parsed['content_json'] = json_encode($parsed['content_json']);
        }
        if (isset($parsed['content_en_json']) && is_array($parsed['content_en_json'])) {
            $parsed['content_en_json'] = json_encode($parsed['content_en_json']);
        }

        $parsed['category_id'] = $inputs['category_id'] ?? null;
        $parsed['affiliate_id'] = $inputs['affiliate_id'] ?? null;
        $parsed['lang'] = $inputs['lang'] ?? 'es';
        $parsed['post_type'] = $inputs['post_type'] ?? 'tutorial';

        return $parsed;
    }
}
