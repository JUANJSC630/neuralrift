---
name: neuralrift-design-pass
description: 'Run the full NeuralRift UI improvement workflow for a page or component. Use when you want one slash command to audit, choose follow-up design passes, preserve CLAUDE.md rules, and validate safely with npm run check and npm run build.'
argument-hint: '[page-or-component]'
user-invocable: true
---

# NeuralRift Design Pass

Run a controlled UI improvement workflow for a specific page or component in NeuralRift.

This skill exists because the generic design skills are useful, but they can misread deliberate design decisions in this repository. In NeuralRift, [CLAUDE.md](../../../../CLAUDE.md) is the source of truth for protected design rules and implementation constraints.

## Use This When

- You want a single slash command for a full page or component pass
- You want to audit first, then apply only the necessary follow-up work
- You need strict guardrails so generic design heuristics do not override NeuralRift decisions
- You want a repeatable workflow for public pages, blog components, or admin surfaces

## Critical Rule Hierarchy

Apply these in this exact order:

1. [CLAUDE.md](../../../../CLAUDE.md)
2. Current codebase conventions
3. This skill
4. Generic design skills such as `/audit`, `/distill`, `/typeset`, `/colorize`, `/optimize`, `/adapt`, `/polish`

If a generic skill recommendation conflicts with [CLAUDE.md](../../../../CLAUDE.md), the generic recommendation is wrong for this project.

## Protected Decisions That Must Not Be Changed

Before doing anything else, re-read [CLAUDE.md](../../../../CLAUDE.md) and preserve at minimum:

- The required fonts: Playfair Display, DM Sans, JetBrains Mono
- The exact `nr-*` color palette values
- The `text-gradient` logo treatment in navbar and footer
- `glass` and `glass-strong` usage on public surfaces
- `border-gradient-animated` in `PostCardFeatured`
- The Home hero constellation nodes and SVG connector lines
- `MeshBackground` on required pages
- The rotating hero headline structure and accessibility behavior
- The custom cursor mounted through navbar
- Existing Framer Motion patterns that are intentionally part of the design
- Tiptap rendering through `renderContent()`
- Inertia `Head` usage with `title` prop and meta-only children

Also note that `.impeccable.md` contains outdated font guidance for this repo and must not override [CLAUDE.md](../../../../CLAUDE.md).

## Workflow

### 1. Scope the target

Work on one target only.

Examples:

- `Home.tsx`
- `Blog/Show.tsx`
- `Navbar.tsx`
- `PostCardFeatured.tsx`
- `Admin/Analytics.tsx`

If the user asks for the whole project, split it into targets using [target-order.md](./references/target-order.md) and process them one by one.

### 2. Establish local context

Read the target file and any directly related shared components, styles, or utilities.

Always verify whether the target is:

- Public UI or admin UI
- Content-heavy or interaction-heavy
- SSR-sensitive
- Typography-sensitive
- Responsive-risky
- Performance-sensitive

### 3. Run audit first

Start with `/audit` logic, but treat it as a diagnostic step rather than a source of truth.

Audit for:

- Accessibility
- Performance
- Responsive behavior
- Theming/token consistency
- Real anti-patterns that do not conflict with [CLAUDE.md](../../../../CLAUDE.md)

Do not count these as anti-patterns in NeuralRift when they match [CLAUDE.md](../../../../CLAUDE.md):

- Gradient logo text
- Purple and cyan brand system
- Public glassmorphism
- Editorial serif display typography
- Framer Motion emphasis in hero and cards
- Mesh backgrounds and constellation visuals

### 4. Choose only the needed follow-up passes

Do not run every follow-up skill automatically. Pick only what the audit actually justifies.

Use this mapping:

- Clutter, redundancy, weak hierarchy: `/distill`
- Typography scale, measure, readability, hierarchy: `/typeset`
- Token usage or color hierarchy issues using existing `nr-*` tokens only: `/colorize`
- Image loading, render cost, SSR safety, animation performance: `/optimize`
- Mobile, tablet, touch targets, overflow, layout reflow: `/adapt`
- Final alignment, spacing, states, consistency: `/polish`

### 5. Apply changes conservatively

When making changes:

- Preserve public APIs unless the target requires otherwise
- Avoid repo-wide edits from a single run
- Prefer token reuse over new values
- Prefer fixing root causes over one-off overrides
- Do not simplify away brand identity

### 6. Validate after changes

After edits for the target are complete, run:

```bash
npm run check
npm run build
```

If one of these fails because of unrelated existing issues, report that clearly and isolate whether your changes introduced anything new.

### 7. Summarize outcome

Report back with:

- What was changed
- Which follow-up passes were used and why
- What was intentionally left untouched because of [CLAUDE.md](../../../../CLAUDE.md)
- Validation results from `npm run check` and `npm run build`
- Any residual risks or manual visual checks still worth doing

## Required Guardrail Prompt

Before applying any audit or follow-up logic, restate these constraints internally and follow them throughout the task:

```text
Respect CLAUDE.md strictly.
Do not change Playfair Display, DM Sans, or JetBrains Mono.
Do not change any nr color hex values.
Do not remove or replace the text-gradient logo.
Do not remove glass or glass-strong from public UI.
Do not simplify or replace intentional Framer Motion behavior.
Do not remove the Home constellation, MeshBackground, CustomCursor, or PostCardFeatured gradient border.
Do not break Inertia SSR rules.
Do not put link tags inside Head.
Always use renderContent() for Tiptap post content.
Work only on the requested target.
```

## Public vs Admin Expectations

- Public pages: preserve editorial dark aesthetic and glass usage
- Admin pages: `bg-nr-surface` is acceptable and often preferred
- Public UI should not be normalized into generic SaaS styling
- Admin polish can be cleaner and more restrained, but still must use project tokens and conventions

## Suggested Processing Order For Whole-Project Work

If the user wants to cover the full project, process targets in the order documented in [target-order.md](./references/target-order.md).

Do not attempt a single giant pass across all files.

## Never Do These

- Do not let generic font replacement guidance override [CLAUDE.md](../../../../CLAUDE.md)
- Do not rewrite the visual language to satisfy anti-AI-slop heuristics
- Do not remove motion just because it is noticeable
- Do not replace public `glass` surfaces with admin `bg-nr-surface`
- Do not introduce hard-coded colors where tokens already exist
- Do not change branding while trying to improve readability or performance
- Do not skip validation after edits

## Reference

Use [target-order.md](./references/target-order.md) when the request is broad or project-wide.