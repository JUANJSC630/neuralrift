<?php

namespace App\AI\Prompts;

class TutorialPostPrompt extends BasePostPrompt
{
    public function build(array $inputs): string
    {
        $topic         = $inputs['topic'];
        $lang          = $inputs['lang'] ?? 'es';
        $level         = $inputs['level'] ?? 'intermedio';
        $tone          = $inputs['tone'] ?? 'tecnico';
        $extraNotes    = $inputs['extra_notes'] ?? '';
        $affiliateName = $inputs['affiliate_name'] ?? '';
        $categoryName  = $inputs['category_name'] ?? '';

        $categoryLine   = $categoryName  ? "CATEGORÍA: {$categoryName}"                                             : '';
        $affiliateLine  = $affiliateName ? "MENCIONAR HERRAMIENTA AFILIADA NATURALMENTE EN CONTEXTO: {$affiliateName}" : '';
        $extraNotesLine = $extraNotes    ? "NOTAS: {$extraNotes}"                                                    : '';

        return <<<PROMPT
Eres el editor principal de {$this->siteName}, blog técnico para {$this->audience}.
Tagline: "{$this->siteTagline}".

Tu misión: escribir un tutorial técnico completo, práctico y accionable.
El lector debe poder IMPLEMENTAR lo que explicas al terminar de leer.
Usa ejemplos de código reales, no pseudocódigo genérico.

TEMA DEL TUTORIAL: {$topic}
NIVEL: {$level} (basico = sin prerrequisitos, intermedio = conocimientos básicos asumidos, avanzado = expertise previo)
TONO: {$tone}
{$categoryLine}
{$affiliateLine}
{$extraNotesLine}

ESTRUCTURA OBLIGATORIA DEL TUTORIAL (en Tiptap JSON):
1. Párrafo introducción: qué aprenderás y qué problema resuelve (hook fuerte)
2. H2: Prerrequisitos (lista breve de lo que necesitas saber/tener)
3. H2: [Paso 1 — nombre descriptivo]
   - Explicación
   - Bloque de código con comentarios claros
4. H2: [Paso 2 — nombre descriptivo]
   - Explicación
   - Bloque de código
5. (Repetir pasos según sea necesario, mínimo 3 pasos)
6. H2: Resultado final / Demo (qué obtienes al seguir el tutorial)
7. H2: Errores comunes y cómo solucionarlos (al menos 2-3 errores típicos)
8. H2: Próximos pasos (qué aprender después, enlace a herramienta afiliada si aplica)
9. Párrafo conclusión con CTA de newsletter

LONGITUD: 1200-2000 palabras. Los tutoriales deben ser exhaustivos.

CÓDIGO: Usa bloques de código con el lenguaje especificado. Incluye comentarios
explicativos en el código. Si el tema es Laravel, usa PHP. Si es frontend, usa
TypeScript/React. Adapta al tema del tutorial.

SEO: keyword principal en meta_title, H1 implícito en el título, keywords
secundarias distribuidas naturalmente en H2s y párrafos.

{$this->tiptapInstructions()}

{$this->outputFormatInstructions($lang)}
PROMPT;
    }
}
