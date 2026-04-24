<?php

namespace App\AI\Prompts;

class TutorialPostPrompt extends BasePostPrompt
{
    public function build(array $inputs): string
    {
        $topic = $inputs['topic'];
        $lang = $inputs['lang'] ?? 'es';
        $level = $inputs['level'] ?? 'intermedio';
        $tone = $inputs['tone'] ?? 'tecnico';
        $extraNotes = $inputs['extra_notes'] ?? '';
        $affiliateName = $inputs['affiliate_name'] ?? '';
        $categoryName = $inputs['category_name'] ?? '';

        $categoryLine = $categoryName ? "CATEGORÍA: {$categoryName}" : '';
        $affiliateLine = $affiliateName ? "MENCIONAR HERRAMIENTA AFILIADA NATURALMENTE EN CONTEXTO: {$affiliateName}" : '';
        $extraNotesLine = $extraNotes ? "NOTAS: {$extraNotes}" : '';

        $structureVariants = [
            'pasos-clasicos' => <<<'VAR'
Empieza con el problema que resuelve el tutorial — no con una lista de prerrequisitos.
Luego ve directo a los pasos, uno por uno, cada uno con código real y explicación.
Cierra con errores comunes y qué aprender después.
Los H2 de pasos deben ser descriptivos ("Configura el middleware de autenticación"),
no genéricos ("Paso 3").
VAR,
            'resultado-primero' => <<<'VAR'
Muestra el resultado final al principio: el código completo funcional o una
descripción del output, antes de explicar cómo llegar ahí.
Eso crea un contrato claro con el lector sobre lo que va a lograr.
Luego desmonta el resultado en pasos comprensibles.
VAR,
            'problema-narrativo' => <<<'VAR'
Abre con un escenario real de frustración o error que el lector probablemente
ha vivido. Eso crea identificación inmediata.
El tutorial resuelve ese problema específico, no uno abstracto.
Integra anécdotas o decisiones de diseño reales mientras explicas los pasos.
VAR,
            'concepto-luego-practica' => <<<'VAR'
Dedica la primera sección a explicar el "por qué" conceptual antes del código.
El lector debe entender el modelo mental antes de ejecutar comandos.
Luego la parte práctica fluye con más sentido y se retiene mejor.
VAR,
        ];

        $angles = array_keys($structureVariants);
        $chosenAngle = $angles[array_rand($angles)];
        $structureGuide = $structureVariants[$chosenAngle];

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

ENFOQUE NARRATIVO PARA ESTE POST — ángulo: {$chosenAngle}:
{$structureGuide}

REQUISITOS DE CONTENIDO (organízalos según el enfoque, no como lista fija):
- Introducción con hook claro: el problema que se resuelve
- Contexto técnico o prerrequisitos (breve, solo lo esencial)
- Al menos 3-4 bloques de implementación con código comentado
- Manejo de errores o casos edge: al menos 2 situaciones reales
- Cierre con siguiente paso lógico y CTA

VARIEDAD DE ESCRITURA:
- Los H2 deben ser nombres descriptivos de lo que hace ese bloque,
  no etiquetas genéricas como "Introducción" o "Conclusión".
- Intercala observaciones personales entre los pasos: por qué elegiste
  esta aproximación, qué alternativas existen y por qué no las usas.
- Varía la densidad: párrafos técnicos densos seguidos de una oración
  corta de respiro. No todo puede ser el mismo tono.
- Nunca comiences dos H2 consecutivos con la misma estructura de frase.

CÓDIGO: Bloques con lenguaje especificado. Comentarios que expliquen el
"por qué", no solo el "qué". Adapta al tema (Laravel→PHP, frontend→TS/React).

LONGITUD: 1200-2000 palabras. Exhaustivo, no relleno.

SEO: keyword principal en meta_title, keywords secundarias distribuidas
naturalmente en H2s y párrafos — nunca forzadas.

{$this->tiptapInstructions()}

{$this->outputFormatInstructions($lang)}
PROMPT;
    }
}
