<?php

namespace App\AI\Prompts;

class ReviewPostPrompt extends BasePostPrompt
{
    public function build(array $inputs): string
    {
        $toolName = $inputs['topic'];
        $lang = $inputs['lang'] ?? 'es';
        $tone = $inputs['tone'] ?? 'tecnico';
        $extraNotes = $inputs['extra_notes'] ?? '';
        $affiliateName = $inputs['affiliate_name'] ?? '';
        $categoryName = $inputs['category_name'] ?? '';
        $rating = $inputs['personal_rating'] ?? '4.5';

        $categoryLine = $categoryName ? "CATEGORÍA: {$categoryName}" : '';
        $affiliateLine = $affiliateName ? "PROGRAMA DE AFILIADO DISPONIBLE — mencionar el link naturalmente: {$affiliateName}" : '';
        $extraNotesLine = $extraNotes ? "NOTAS DEL AUTOR SOBRE LA HERRAMIENTA: {$extraNotes}" : '';

        $structureVariants = [
            'veredicto-primero' => <<<'VAR'
Abre con el veredicto claro: "Después de usarla X semanas, mi conclusión es..."
El lector sabe desde el principio si vale la pena seguir leyendo.
El resto del artículo justifica esa posición con evidencia.
No guardes la conclusión para el final — eso frustra a los lectores ocupados.
VAR,
            'experiencia-personal' => <<<'VAR'
Abre con el momento específico en que empezaste a usar la herramienta:
el problema concreto que intentabas resolver.
Narra cómo fue el proceso — lo que funcionó y lo que no — como si le contases
la historia a un colega. Intercala la información técnica dentro de la narrativa.
VAR,
            'comparativa-anclada' => <<<'VAR'
Abre posicionando la herramienta contra su alternativa más conocida del mercado.
El lector ya conoce la referencia — úsala para anclar la evaluación desde el inicio.
Cada sección compara implícita o explícitamente con esa referencia.
VAR,
            'caso-de-uso-real' => <<<'VAR'
Estructura la review alrededor de 2-3 casos de uso concretos que probaste.
Cada caso revela un aspecto diferente (rendimiento, UX, precio, soporte).
La opinión emerge de los casos, no de listas abstractas de pros/contras.
VAR,
        ];

        $angles = array_keys($structureVariants);
        $chosenAngle = $angles[array_rand($angles)];
        $structureGuide = $structureVariants[$chosenAngle];

        return <<<PROMPT
Eres el editor principal de {$this->siteName}, blog técnico para {$this->audience}.
Tagline: "{$this->siteTagline}".

Tu misión: escribir una review HONESTA y detallada de una herramienta.
El autor la ha probado personalmente. Opinión editorial genuina, no marketing.

HERRAMIENTA A REVISAR: {$toolName}
CALIFICACIÓN PERSONAL DEL AUTOR: {$rating}/5
TONO: {$tone}
{$categoryLine}
{$affiliateLine}
{$extraNotesLine}

ENFOQUE NARRATIVO PARA ESTE POST — ángulo: {$chosenAngle}:
{$structureGuide}

REQUISITOS DE CONTENIDO (adapta el orden y forma al enfoque elegido):
- Qué es la herramienta y qué problema resuelve (breve, sin relleno)
- Qué funciona bien: específico, con ejemplos o situaciones concretas
- Qué no funciona o decepciona: al menos 2-3 contras reales. Sin esto no es review
- Precios y planes: cuánto cuesta usarla de verdad, incluye plan gratuito si existe
- Para quién sí y para quién no sirve: directo, sin eufemismos
- Alternativas reales: 2-3 opciones que vale la pena considerar
- Veredicto con la calificación {$rating}/5 y CTA natural si hay afiliado

VARIEDAD DE ESCRITURA:
- No estructures los pros/contras siempre como dos listas separadas. A veces
  es más honesto mezclarlos o presentarlos en contexto de uso.
- Los H2 deben reflejar el ángulo narrativo elegido, no ser siempre
  "Lo que me gustó" / "Lo que no me gustó" — eso es predecible.
- Incluye al menos una observación que contradiga la narrativa de marketing
  oficial de la herramienta. Eso es lo que diferencia una review real.
- Varía el tono entre secciones: puedes ser más directo en los contras
  y más matizado en el veredicto, o al revés según el caso.

HONESTIDAD: Una review sin defectos es publicidad. Los lectores lo detectan.

LONGITUD: 1000-1500 palabras. Completa pero sin relleno.

SEO: El título puede ser "[Herramienta]: Review [año]" u otras variantes creativas.
keyword principal en meta_title y meta_description.

{$this->tiptapInstructions()}

{$this->outputFormatInstructions($lang)}
PROMPT;
    }
}
