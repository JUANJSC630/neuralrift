<!DOCTYPE html>
<html lang="{{ $subscriber->lang === 'en' ? 'en' : 'es' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $post->title }}</title>
</head>
<body style="margin:0;padding:0;background-color:#080B12;font-family:system-ui,-apple-system,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#080B12;">
        <tr>
            <td align="center" style="padding:40px 20px;">
                <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;">
                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding-bottom:32px;">
                            <a href="{{ url('/') }}" style="text-decoration:none;">
                                <span style="font-size:28px;font-weight:900;background:linear-gradient(to right,#7C6AF7,#06B6D4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                                    NeuralRift
                                </span>
                            </a>
                        </td>
                    </tr>
                    <!-- Card -->
                    <tr>
                        <td style="background-color:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
                            @php
                                $isEn = $subscriber->lang === 'en';
                                $title = $isEn && $post->title_en ? $post->title_en : $post->title;
                                $excerpt = $isEn && $post->excerpt_en ? $post->excerpt_en : $post->excerpt;
                                $slug = $isEn && $post->slug_en ? $post->slug_en : $post->slug;
                                $postUrl = $isEn ? url("/en/blog/{$slug}") : url("/blog/{$slug}");
                            @endphp

                            @if($post->cover_image)
                                <img src="{{ $post->cover_image }}" alt="{{ $title }}" width="560" style="width:100%;height:auto;display:block;">
                            @endif

                            <div style="padding:32px 40px 40px;">
                                @if($post->category)
                                    <span style="display:inline-block;padding:4px 12px;border-radius:20px;background-color:rgba(124,106,247,0.15);color:#7C6AF7;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:16px;">
                                        {{ $isEn && $post->category->name_en ? $post->category->name_en : $post->category->name }}
                                    </span>
                                @endif

                                <h1 style="margin:0 0 16px;color:#F1F5F9;font-size:22px;font-weight:700;line-height:1.3;">
                                    {{ $title }}
                                </h1>

                                @if($excerpt)
                                    <p style="margin:0 0 24px;color:#94A3B8;font-size:15px;line-height:1.6;">
                                        {{ $excerpt }}
                                    </p>
                                @endif

                                <table role="presentation" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td style="border-radius:10px;background-color:#7C6AF7;">
                                            <a href="{{ $postUrl }}"
                                               style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;">
                                                {{ $isEn ? 'Read article' : 'Leer artículo' }}
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin:24px 0 0;color:#6B7280;font-size:12px;">
                                    ⏱ {{ $post->read_time }} min · {{ $post->published_at?->format('d M Y') }}
                                </p>
                            </div>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding-top:24px;color:#6B7280;font-size:12px;">
                            © {{ date('Y') }} NeuralRift · {{ $isEn ? 'Technology, AI and tools to build better' : 'Tecnología, IA y herramientas para construir mejor' }}
                            <br>
                            <a href="{{ $subscriber->getUnsubscribeUrl() }}" style="color:#6B7280;text-decoration:underline;">
                                {{ $isEn ? 'Unsubscribe' : 'Cancelar suscripción' }}
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
