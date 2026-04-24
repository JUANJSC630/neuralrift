<?php

namespace App\AI\Prompts;

class NewsPostPrompt extends BasePostPrompt
{
    public function build(array $inputs): string
    {
        $topic = $inputs['topic'];
        $sourceUrl = $inputs['source_url'] ?? '';
        $lang = $inputs['lang'] ?? 'es';
        $tone = $inputs['tone'] ?? 'tecnico';
        $extraNotes = $inputs['extra_notes'] ?? '';
        $affiliateName = $inputs['affiliate_name'] ?? '';
        $categoryName = $inputs['category_name'] ?? '';

        $sourceUrlLine = $sourceUrl ? "FUENTE DE REFERENCIA: {$sourceUrl}" : '';
        $categoryLine = $categoryName ? "CATEGORÍA DEL BLOG: {$categoryName}" : '';
        $affiliateLine = $affiliateName ? "MENCIONAR HERRAMIENTA AFILIADA NATURALMENTE: {$affiliateName}" : '';
        $extraNotesLine = $extraNotes ? "NOTAS ADICIONALES: {$extraNotes}" : '';

        $structureVariants = [
            'impacto-primero' => <<<'VAR'
Abre con la consecuencia o implicación más importante — no con los hechos.
El lector debe entender en la primera oración por qué esto cambia algo.
Luego narra qué pasó, y cierra con tu análisis personal y contexto más amplio.
VAR,
            'pregunta-retórica' => <<<'VAR'
Abre con una pregunta directa e incómoda que el tema provoca.
No la respondas de inmediato — deja que la tensión guíe la lectura.
Responde la pregunta a mitad del artículo, con evidencia.
Cierra con una posición editorial clara, no neutral.
VAR,
            'dato-impactante' => <<<'VAR'
Abre con un dato, número o hecho específico que sorprenda.
Usa ese dato como hilo conductor de todo el artículo.
El análisis debe volver a él y ampliarlo con contexto.
VAR,
            'narrativa-contextual' => <<<'VAR'
Abre construyendo el contexto histórico o tecnológico antes de la noticia.
El lector debe entender el "antes" para valorar el "ahora".
El clímax es la noticia misma; el análisis editorial va al final.
VAR,
        ];

        $angles = array_keys($structureVariants);
        $chosenAngle = $angles[array_rand($angles)];
        $structureGuide = $structureVariants[$chosenAngle];

        return <<<PROMPT
Eres el editor principal de {$this->siteName}, un blog técnico bilingüe para {$this->audience}.
Tagline del blog: "{$this->siteTagline}".

Tu misión: escribir una noticia técnica completa, con voz propia y criterio editorial.
NO copies ni parafrasees la fuente. Analiza, contextualiza, opina.

TEMA / NOTICIA: {$topic}
{$sourceUrlLine}
TONO: {$tone} (tecnico = análisis profundo, accesible = explicación simple, opinion = punto de vista crítico)
{$categoryLine}
{$affiliateLine}
{$extraNotesLine}

ENFOQUE NARRATIVO PARA ESTE POST — ángulo: {$chosenAngle}:
{$structureGuide}

REQUISITOS DE CONTENIDO (no son secciones fijas — adáptalos al enfoque):
- La noticia en sí: qué ocurrió, quiénes están implicados, cuándo
- Por qué importa: impacto real en la industria o en quien lee
- Análisis o perspectiva editorial: tu punto de vista crítico, no neutro
- Al menos un ángulo no obvio que la mayoría de medios no cubriría
- Cierre con dirección clara (qué hacer, qué observar, a qué suscribirse)

VARIEDAD DE ESCRITURA:
- No uses los mismos patrones de apertura en cada post. Si el tono es técnico,
  no empieces con "En el mundo de la IA..." — eso es genérico.
- Varía la longitud de los párrafos: mezcla párrafos cortos (1-2 oraciones) con
  otros más desarrollados. Eso crea ritmo de lectura.
- Los H2 no tienen que ser preguntas. Pueden ser afirmaciones, frases nominales
  o fragmentos de idea. Elige el formato que mejor sirva a ese bloque.
- Escribe como una persona que tiene una opinión formada, no como un resumen.

LONGITUD: 600-900 palabras. Conciso pero sustancioso.

SEO: El meta_title debe incluir el año actual (2026) y la keyword principal.
La meta_description debe provocar curiosidad y tener la keyword.

{$this->tiptapInstructions()}

{$this->outputFormatInstructions($lang)}
PROMPT;
    }
}
