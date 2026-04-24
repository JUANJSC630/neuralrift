<?php

namespace App\AI\Prompts;

abstract class BasePostPrompt
{
    protected string $siteName = '';

    protected string $siteTagline = '';

    protected string $audience = 'developers, freelancers y emprendedores';

    public function __construct()
    {
        $this->siteName = config('site.name', 'NeuralRift');
        $this->siteTagline = config('site.tagline', 'Tecnología, IA y herramientas para construir mejor');
    }

    abstract public function build(array $inputs): string;

    protected function tiptapInstructions(): string
    {
        return <<<'TIPTAP'
El campo "content_json" y "content_en_json" deben ser JSON válido
compatible con el formato de Tiptap Editor. Usa exactamente esta estructura:

{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 2 },
      "content": [{ "type": "text", "text": "Título de sección" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Párrafo de contenido aquí." }]
    },
    {
      "type": "bulletList",
      "content": [
        {
          "type": "listItem",
          "content": [
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Ítem de lista" }]
            }
          ]
        }
      ]
    },
    {
      "type": "codeBlock",
      "attrs": { "language": "php" },
      "content": [{ "type": "text", "text": "// código aquí" }]
    }
  ]
}

Tipos de nodos permitidos: heading (level 1-3), paragraph, bulletList,
orderedList, listItem, blockquote, codeBlock, hardBreak.
Para texto en negrita: { "type": "text", "text": "texto", "marks": [{ "type": "bold" }] }
Para links: { "type": "text", "text": "texto", "marks": [{ "type": "link", "attrs": { "href": "url" } }] }
TIPTAP;
    }

    protected function outputFormatInstructions(string $lang): string
    {
        $langInstruction = match ($lang) {
            'es' => 'Genera SOLO en español. Los campos _en déjalos vacíos string "".',
            'en' => 'Genera SOLO en inglés. Los campos sin _en déjalos vacíos string "".',
            'both' => 'Genera en ambos idiomas. Campos sin _en en español, campos con _en en inglés.',
            default => 'Genera en español.',
        };

        return <<<OUTPUT
{$langInstruction}

Responde ÚNICAMENTE con un objeto JSON válido, sin markdown, sin backticks,
sin texto adicional antes o después. El JSON debe tener exactamente esta estructura:

{
  "title": "Título completo en español",
  "title_en": "Full title in English",
  "excerpt": "Resumen de 150-200 caracteres en español para SEO",
  "excerpt_en": "150-200 character summary in English for SEO",
  "meta_title": "Meta título optimizado en español (máximo 60 caracteres)",
  "meta_title_en": "Optimized meta title in English (max 60 characters)",
  "meta_description": "Meta descripción en español (120-155 caracteres, incluye keyword principal)",
  "meta_description_en": "Meta description in English (120-155 characters, includes main keyword)",
  "content_json": { ... },
  "content_en_json": { ... },
  "category_id": null,
  "affiliate_id": null,
  "suggested_tags": ["tag1", "tag2", "tag3"],
  "lang": "{$lang}",
  "estimated_read_time": 7,
  "post_type": "tutorial"
}
OUTPUT;
    }
}
