# NeuralRift Target Order

Use this order when the user wants a whole-project pass. Process one target at a time and validate between targets.

## Order

1. Layout foundations
   - `resources/js/Components/Layout/Navbar.tsx`
   - `resources/js/Components/Layout/Footer.tsx`
   - `resources/js/Components/Layout/MeshBackground.tsx`
   - `resources/js/Components/Layout/CustomCursor.tsx`

2. Public priority pages
   - `resources/js/Pages/Home.tsx`
   - `resources/js/Pages/Blog/Show.tsx`
   - `resources/js/Pages/Blog/Index.tsx`
   - `resources/js/Pages/Category/Show.tsx`
   - `resources/js/Pages/About.tsx`
   - `resources/js/Pages/Tools.tsx`

3. Blog support components
   - `resources/js/Components/Blog/PostCard.tsx`
   - `resources/js/Components/Blog/PostCardFeatured.tsx`
   - `resources/js/Components/Blog/AffiliateWidget.tsx`
   - `resources/js/Components/Blog/NewsletterWidget.tsx`
   - `resources/js/Components/Blog/TableOfContents.tsx`
   - `resources/js/Components/Blog/ReadingProgress.tsx`
   - `resources/js/Components/Blog/ShareButtons.tsx`

4. Admin surfaces
   - `resources/js/Components/Layout/AdminLayout.tsx`
   - `resources/js/Pages/Admin/Dashboard.tsx`
   - `resources/js/Pages/Admin/Analytics.tsx`
   - `resources/js/Pages/Admin/Newsletter.tsx`
   - `resources/js/Pages/Admin/Settings.tsx`
   - `resources/js/Pages/Admin/Posts/Index.tsx`
   - `resources/js/Pages/Admin/Posts/Edit.tsx`
   - `resources/js/Pages/Admin/Categories/Index.tsx`
   - `resources/js/Pages/Admin/Affiliates/Index.tsx`

## Follow-up Selection Matrix

- Use `/typeset` first for reading pages and article content
- Use `/adapt` first for navigation, filters, TOC, and mobile-heavy surfaces
- Use `/optimize` first for animation-heavy or image-heavy targets
- Use `/distill` only when the target is actually cluttered
- Use `/colorize` mainly for admin hierarchy or token cleanup, not to invent a new palette
- Use `/polish` last on every target that changed

## Validation After Each Target

Run:

```bash
npm run check
npm run build
```

Then visually verify at minimum:

- Home
- Blog index
- Blog show
- About
- Tools
- One category page
- Admin dashboard
- Admin analytics

## Stop Conditions

Pause and ask the user before continuing if:

- A proposed change conflicts with `CLAUDE.md`
- Validation fails and the failure may be related to your edits
- The target appears to require a broader shared-component refactor
- There are significant unrelated existing changes in the same files that make intent unclear