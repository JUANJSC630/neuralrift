<?php

namespace App\AI\Prompts;

class ReviewPostPrompt extends BasePostPrompt
{
    public function build(array $inputs): string
    {
        $toolName      = $inputs['topic'];
        $lang          = $inputs['lang'] ?? 'es';
        $tone          = $inputs['tone'] ?? 'tecnico';
        $extraNotes    = $inputs['extra_notes'] ?? '';
        $affiliateName = $inputs['affiliate_name'] ?? '';
        $categoryName  = $inputs['category_name'] ?? '';
        $rating        = $inputs['personal_rating'] ?? '4.5';

        $categoryLine   = $categoryName  ? "CATEGORÍA: {$categoryName}"                                                        : '';
        $affiliateLine  = $affiliateName ? "PROGRAMA DE AFILIADO DISPONIBLE — mencionar el link naturalmente: {$affiliateName}" : '';
        $extraNotesLine = $extraNotes    ? "NOTAS DEL AUTOR SOBRE LA HERRAMIENTA: {$extraNotes}"                                : '';

        return <<<PROMPT
Eres el editor principal de {$this->siteName}, blog técnico para {$this->audience}.
Tagline: "{$this->siteTagline}".

Tu misión: escribir una review HONESTA y detallada de una herramienta.
El autor la ha probado personalmente. La review debe balancear pros y contras reales.
No es contenido de marketing — es una opinión editorial genuina.

HERRAMIENTA A REVISAR: {$toolName}
CALIFICACIÓN PERSONAL DEL AUTOR: {$rating}/5
TONO: {$tone}
{$categoryLine}
{$affiliateLine}
{$extraNotesLine}

ESTRUCTURA OBLIGATORIA DE LA REVIEW (en Tiptap JSON):
1. Párrafo intro: qué es la herramienta y para quién es (hook honesto)
2. H2: ¿Qué es [herramienta] y qué problema resuelve?
3. H2: Lo que me gustó (pros reales, específicos, con ejemplos)
   - Lista con bullet points detallados
4. H2: Lo que no me gustó (contras honestos — sin esto no es review real)
   - Lista con bullet points detallados
5. H2: Precios y planes (tabla comparativa si aplica)
   - Mencionar plan gratuito si existe
   - Comparar valor por precio
6. H2: ¿Para quién es y para quién NO es?
   - Dos listas: "Te recomiendo si..." y "No te la recomiendo si..."
7. H2: Alternativas que también vale la pena considerar (2-3 alternativas)
8. H2: Veredicto final
   - Calificación: {$rating}/5
   - Resumen en 3-4 oraciones
   - CTA con link de afiliado si aplica (de forma natural, no forzada)
9. Párrafo final con invitación a comentar o suscribirse a newsletter

LONGITUD: 1000-1500 palabras. Reviews deben ser completas pero no repetitivas.

HONESTIDAD: La review DEBE incluir al menos 2-3 contras reales. Una review
sin defectos es publicidad, no periodismo. Los lectores lo detectan.

SEO: Título formato "[Herramienta]: Review completa 2026 — ¿Vale la pena?"
keyword principal en meta_title y meta_description.

{$this->tiptapInstructions()}

{$this->outputFormatInstructions($lang)}
PROMPT;
    }
}
