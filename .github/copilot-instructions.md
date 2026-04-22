# NeuralRift — GitHub Copilot Instructions

## Project

Laravel 11 backend + Inertia.js v2 + React 18 + TypeScript SPA.
AI/tech blog with admin panel, Tiptap editor, Recharts analytics.

## Commit conventions

All commits must follow **Conventional Commits** format:

```
<type>(<scope>): <description>
```

### Rules
- Max **90 characters** total
- Description in **imperative mood**, no period at the end
- Scope is **always required**
- Write in **English**

### Types
| Type | Use for |
|------|---------|
| `feat` | New feature or visible behavior |
| `fix` | Bug fix |
| `refactor` | Code restructuring, no behavior change |
| `style` | Formatting, class ordering, whitespace |
| `chore` | Config, dependencies, tooling |
| `perf` | Performance improvement |
| `docs` | Documentation or comments |
| `test` | Tests |

### Scopes — use the closest match

**Frontend**
- `ui` — shared components, design system
- `navbar`, `footer`, `layout` — layout components
- `blog` — blog listing, PostCard, PostCardFeatured
- `post` — single post view (Show.tsx), reading progress, TOC
- `home` — Home page hero, rotating words, constellation
- `category` — category pages
- `tools` — tools page
- `about` — about page
- `editor` — Tiptap editor (Admin/Posts/Edit)
- `admin` — admin panel pages/components
- `analytics` — Recharts dashboard

**Backend**
- `posts` — Post model, PostController, routes
- `categories` — Category model/controller
- `affiliates` — Affiliate model/controller
- `subscribers` — Newsletter subscribers
- `auth` — authentication
- `db` — migrations, seeders
- `api` — API routes or responses

**Cross-cutting**
- `config` — Tailwind, Prettier, ESLint, Vite, TypeScript configs
- `deps` — dependency updates (package.json, composer.json)
- `types` — TypeScript type definitions
- `css` — app.css, Tailwind classes, custom styles
- `seo` — meta tags, OG, structured data

### Examples
```
feat(post): add estimated reading time to post header
fix(navbar): prevent glass class missing on scroll in Safari
style(blog): reorder Tailwind classes with prettier-plugin-tailwindcss
refactor(editor): extract renderContent to shared tiptap lib
chore(deps): add prettier-plugin-tailwindcss
perf(home): reduce blur-3xl to blur-2xl on constellation nodes
```
