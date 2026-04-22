<?php

namespace App\AI\Prompts;

class NewsPostPrompt extends BasePostPrompt
{
    public function build(array $inputs): string
    {
        $topic         = $inputs['topic'];
        $sourceUrl     = $inputs['source_url'] ?? '';
        $lang          = $inputs['lang'] ?? 'es';
        $tone          = $inputs['tone'] ?? 'tecnico';
        $extraNotes    = $inputs['extra_notes'] ?? '';
        $affiliateName = $inputs['affiliate_name'] ?? '';
        $categoryName  = $inputs['category_name'] ?? '';

        $sourceUrlLine   = $sourceUrl     ? "FUENTE DE REFERENCIA: {$sourceUrl}"                       : '';
        $categoryLine    = $categoryName  ? "CATEGORÍA DEL BLOG: {$categoryName}"                      : '';
        $affiliateLine   = $affiliateName ? "MENCIONAR HERRAMIENTA AFILIADA NATURALMENTE: {$affiliateName}" : '';
        $extraNotesLine  = $extraNotes    ? "NOTAS ADICIONALES: {$extraNotes}"                          : '';

        return <<<PROMPT
Eres el editor principal de {$this->siteName}, un blog técnico bilingüe para {$this->audience}.
Tagline del blog: "{$this->siteTagline}".

Tu misión: escribir una noticia técnica completa y valiosa para la audiencia del blog.
NO copies ni parafrasees directamente la fuente. Añade análisis, contexto e interpretación
desde la perspectiva de un developer en Latinoamérica.

TEMA / NOTICIA: {$topic}
{$sourceUrlLine}
TONO: {$tone} (tecnico = análisis profundo, accesible = explicación simple, opinion = punto de vista crítico)
{$categoryLine}
{$affiliateLine}
{$extraNotesLine}

ESTRUCTURA DEL ARTÍCULO DE NOTICIA (en Tiptap JSON):
1. Párrafo de contexto (2-3 oraciones que ubican al lector)
2. H2: ¿Qué pasó exactamente? (la noticia en sí)
3. H2: ¿Por qué importa para developers en LATAM?
4. H2: Qué significa esto en la práctica (impacto real)
5. Lista de puntos clave (bullet points)
6. H2: Mi perspectiva / análisis (opinión editorial)
7. Párrafo de cierre con call-to-action a newsletter o herramienta relacionada

LONGITUD: 600-900 palabras. Las noticias deben ser concisas pero completas.

SEO: El meta_title debe incluir el año actual (2026) y la keyword principal.
La meta_description debe provocar curiosidad y tener la keyword.

{$this->tiptapInstructions()}

{$this->outputFormatInstructions($lang)}
PROMPT;
    }
}
