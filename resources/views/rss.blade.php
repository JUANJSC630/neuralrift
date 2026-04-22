<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>NeuralRift</title>
        <link>{{ url('/') }}</link>
        <description>El futuro de la IA empieza aquí</description>
        <language>es</language>
        <atom:link href="{{ url('/feed.xml') }}" rel="self" type="application/rss+xml"/>
        @foreach($posts as $post)
        <item>
            <title><![CDATA[{{ $post->title }}]]></title>
            <link>{{ url("/blog/{$post->slug}") }}</link>
            <guid>{{ url("/blog/{$post->slug}") }}</guid>
            <description><![CDATA[{{ $post->excerpt }}]]></description>
            <pubDate>{{ $post->published_at->toRssString() }}</pubDate>
            <author>noreply@neuralrift.com ({{ $post->author->name }})</author>
            @if($post->category)
            <category>{{ $post->category->name }}</category>
            @endif
        </item>
        @endforeach
    </channel>
</rss>
