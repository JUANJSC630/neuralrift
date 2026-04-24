# NeuralRift

Blog editorial sobre inteligencia artificial con panel de administración completo.
Guías en profundidad, reviews honestas y estrategias para navegar la revolución de la IA.

---

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Laravel 11 (PHP 8.3) |
| Frontend | React 18 + TypeScript + Inertia.js v2 |
| Build | Vite 6 + SSR (`bootstrap/ssr/ssr.js`) |
| Estilos | Tailwind CSS 3 + CSS custom |
| Animaciones | Framer Motion |
| Editor de posts | Tiptap (JSON) con `@tiptap/static-renderer` para SSR |
| Base de datos | MySQL / SQLite |
| Deploy local | Laravel Herd |

---

## Funcionalidades

**Blog público**
- Home con hero animado (constelación de nodos, palabras rotativas)
- Listado de posts con filtros por categoría y búsqueda
- Post individual con barra de progreso de lectura, tabla de contenidos sticky, botones de compartir
- Páginas por categoría con color de marca por categoría
- Página de herramientas IA con filtros por categoría
- Newsletter con doble opt-in (confirmación por email)
- Feed RSS y sitemap XML
- Cursor personalizado animado
- SSR completo para SEO

**Panel de administración** (`/admin`)
- Dashboard con métricas en tiempo real
- Editor de posts con Tiptap (rich text, imágenes, código con syntax highlight)
- Gestión de categorías con color e ícono personalizable
- Gestión de afiliados con tracking de clicks
- Gestión de newsletter con exportación CSV
- Analytics con gráficas (Recharts)
- Configuración del perfil de autor

---

## Instalación

### Requisitos

- PHP 8.3+
- Node.js 20+
- Composer
- MySQL o SQLite
- Laravel Herd (recomendado) o Laravel Valet

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/JUANJSC630/neuralrift.git
cd neuralrift

# 2. Instalar dependencias PHP
composer install

# 3. Instalar dependencias Node
npm install

# 4. Configurar entorno
cp .env.example .env
php artisan key:generate

# 5. Configurar base de datos en .env
# DB_CONNECTION=mysql
# DB_DATABASE=neuralrift
# DB_USERNAME=root
# DB_PASSWORD=

# 6. Ejecutar migraciones y seeders
php artisan migrate --seed

# 7. Crear enlace de almacenamiento
php artisan storage:link

# 8. Compilar assets
npm run build
```

### Desarrollo local

```bash
# Terminal 1 — Vite dev server (HMR)
npm run dev

# Laravel Herd gestiona PHP automáticamente
# Acceder en: https://neuralrift.test
```

---

## Variables de entorno relevantes

```env
APP_NAME=NeuralRift
APP_URL=https://neuralrift.test

# Base de datos
DB_CONNECTION=mysql
DB_DATABASE=neuralrift

# Mail (para confirmación de newsletter)
MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=hola@neuralrift.com
MAIL_FROM_NAME="NeuralRift"

# Sitio (opcionales, mejoran el panel de ajustes)
SITE_DESCRIPTION="Guías en profundidad sobre IA..."
SITE_TWITTER="@neuralrift-blog"
ANALYTICS_ID="G-XXXXXXXXXX"
```

---

## Comandos útiles

```bash
# Calidad de código
npm run type-check    # TypeScript sin emitir
npm run lint          # ESLint
npm run format        # Prettier (reescribe archivos)
npm run format:check  # Prettier (solo verifica)
npm run check         # type-check + lint + format:check

# Build
npm run build         # Client + SSR

# Laravel
php artisan migrate            # Migraciones
php artisan db:seed            # Datos de demo
php artisan optimize:clear     # Limpiar caché
```

---

## Estructura de directorios

```
app/
├── Http/Controllers/
│   ├── Admin/          ← Controladores del panel admin
│   ├── Auth/           ← Autenticación Laravel
│   └── ...             ← Controladores públicos
├── Models/             ← Post, Category, Affiliate, Subscriber, Tag...
database/
├── migrations/         ← Esquema completo de la BD
└── seeders/            ← Datos de demo (posts, categorías, afiliados)
resources/
├── css/app.css         ← Tailwind + clases custom (glass, nr-prose, mesh-bg...)
├── js/
│   ├── Components/
│   │   ├── Blog/       ← PostCard, PostCardFeatured, AffiliateWidget, TOC, ShareButtons...
│   │   └── Layout/     ← Navbar, Footer, MeshBackground, AdminLayout, CustomCursor
│   ├── Pages/
│   │   ├── Admin/      ← Dashboard, Analytics, Newsletter, Settings, Posts, Categories...
│   │   ├── Blog/       ← Index, Show
│   │   ├── Category/   ← Show
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── Tools.tsx
│   ├── hooks/          ← useReadingProgress, useDebounce
│   ├── lib/            ← constants, tiptap (renderContent), utils
│   └── types/          ← TypeScript interfaces
routes/web.php          ← Rutas públicas + admin + auth
```

---

## Diseño

Sistema de diseño editorial con aesthetic oscuro/tech:

- **Tipografía:** Playfair Display (headings) + DM Sans (UI) + JetBrains Mono (código)
- **Color principal:** `#7C6AF7` (violeta) + `#06B6D4` (cyan)
- **Fondo:** `#080B12`
- **Glassmorphism:** `backdrop-filter: blur(24px)` en cards y superficies
- **Animaciones:** Framer Motion en hero, cards y transiciones de página

Ver `CLAUDE.md` para la documentación completa del sistema de diseño y las restricciones del proyecto.

---

## Licencia

Proyecto privado — todos los derechos reservados.
