// resources/js/types/index.d.ts

export interface User {
    id: number
    name: string
    email: string
    email_verified_at?: string | null
    avatar?: string
    bio?: string
    twitter?: string
    linkedin?: string
    website?: string
    skills?: string[]
    role: 'admin' | 'editor' | 'author'
}

export interface Category {
    id: number
    name: string
    name_en?: string
    slug: string
    description?: string
    description_en?: string
    color: string
    icon?: string
    order?: number
    posts_count?: number
}

export interface Post {
    id: number
    title: string
    title_en?: string
    slug: string
    slug_en?: string
    excerpt?: string
    excerpt_en?: string
    content: string
    content_en?: string
    cover_image?: string
    og_image?: string
    meta_title?: string
    meta_description?: string
    status: 'draft' | 'review' | 'scheduled' | 'published'
    lang: 'es' | 'en' | 'both'
    featured: boolean
    allow_comments: boolean
    indexable: boolean
    read_time: number
    views_count: number
    likes_count: number
    comments_count?: number
    published_at?: string
    created_at: string
    updated_at: string
    author: User
    category?: Category
    tags?: Tag[]
    affiliates?: Affiliate[]
}

export interface Affiliate {
    id: number
    name: string
    slug: string
    logo?: string
    url: string
    website?: string
    description?: string
    commission?: string
    commission_type: 'recurring' | 'one_time' | 'percentage'
    commission_value?: number
    cookie_duration?: string
    pros?: string[]
    cons?: string[]
    rating?: number
    category?: string
    badge?: string
    active: boolean
    featured: boolean
    clicks_count: number
    order?: number
}

export interface Tag {
    id: number
    name: string
    slug: string
}

export interface Comment {
    id: number
    post_id: number
    parent_id: number | null
    author_name: string
    body: string
    depth: number
    created_at: string
    replies?: Comment[]
}

export interface Subscriber {
    id: number
    email: string
    name?: string
    lang: string
    confirmed: boolean
    created_at: string
}

export interface PaginatedData<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
    links: { url: string | null; label: string; active: boolean }[]
}

// Shared props injected by HandleInertiaRequests middleware
export interface SharedProps {
    auth: { user: User | null }
    site: {
        name: string
        tagline: string
        twitter: string
        description: string
        url: string
        email: string
        author: string
    }
    categories: Category[]
    locale: 'es' | 'en'
    flash: { success?: string; error?: string }
    [key: string]: unknown
}

// Inertia shared props — extend with page-specific props as needed
export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = SharedProps & T
