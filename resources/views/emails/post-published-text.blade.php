@php
    $isEn = $subscriber->lang === 'en';
    $title = $isEn && $post->title_en ? $post->title_en : $post->title;
    $excerpt = $isEn && $post->excerpt_en ? $post->excerpt_en : $post->excerpt;
    $slug = $isEn && $post->slug_en ? $post->slug_en : $post->slug;
    $postUrl = $isEn ? url("/en/blog/{$slug}") : url("/blog/{$slug}");
@endphp
{{ $isEn ? 'New post on NeuralRift' : 'Nuevo artículo en NeuralRift' }}

{{ $title }}

@if($excerpt)
{{ $excerpt }}

@endif
{{ $isEn ? 'Read article' : 'Leer artículo' }}: {{ $postUrl }}

---
{{ $isEn ? 'Unsubscribe' : 'Cancelar suscripción' }}: {{ $subscriber->getUnsubscribeUrl() }}

© {{ date('Y') }} NeuralRift
