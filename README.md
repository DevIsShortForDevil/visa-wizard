<div align="center">

# ✈️ Visa Wizard

**A multi-step travel visa application wizard built as a frontend interview assignment.**

[![Nuxt](https://img.shields.io/badge/Nuxt-4.4.8-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](./LICENSE)

[🚀 Live Demo](https://visa-wizard.vercel.app) · [📖 Architecture](#-architecture-overview) · [⚡ Quick Start](#-quick-start)

</div>

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Architecture Overview](#-architecture-overview)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Data Flow](#data-flow)
- [Key Decisions](#-key-decisions)
  - [API & Caching Strategy](#api--caching-strategy)
  - [Server Route Proxy](#server-route-proxy)
  - [Pagination Architecture](#pagination-architecture)
  - [Fuzzy Search](#fuzzy-search)
  - [Component Architecture](#component-architecture)
  - [Form Validation](#form-validation)
  - [State Management](#state-management)
  - [Styling Approach](#styling-approach)
  - [Code Style](#code-style)
  - [Testing Strategy](#testing-strategy)
  - [Docker](#docker)
- [Environment Variables](#-environment-variables)
- [Running Tests](#-running-tests)
- [Deployment](#-deployment)
- [Known Limitations & Trade-offs](#-known-limitations--trade-offs)

---

## ⚡ Quick Start

```bash
# 1. Clone and install
git clone https://github.com/JWTTeam/frontend-assignment-visa-wizard_DevIsShortForDevil.git
cd frontend-assignment-visa-wizard_DevIsShortForDevil
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in BASE_URL and API_KEY in .env

# 3. Start development server
npm run dev
```

> App runs at `http://localhost:3000`

**Or run with Docker:**

```bash
docker build -t visa-wizard .
docker run -p 3000:3000 --env-file .env visa-wizard
```

---

## ✨ Features

| Feature                     | Details                                                                |
| --------------------------- | ---------------------------------------------------------------------- |
| 🗺️ **Multi-step wizard**    | Geography → Identity → Review & Submit with free navigation            |
| 🔍 **Searchable dropdowns** | Infinite scroll with server-side search and fuzzy fallback             |
| 🌍 **Country exclusion**    | Can't select the same country for citizenship and destination          |
| 📱 **Phone prefix**         | Auto-populated from citizenship country's calling code                 |
| ✅ **Inline validation**    | Real-time field validation via Zod v4 with touched state               |
| 📋 **Submissions list**     | Persisted session list with status badges and animated entry           |
| 🔀 **Fuzzy search**         | Typo-tolerant search via Fuse.js server-side fallback                  |
| 🐳 **Docker**               | Multi-stage Dockerfile for efficient production images                 |
| 🧪 **Unit tests**           | Vitest tests for `useZodForm` composable and `GeographyStep` component |

---

## 🏗️ Architecture Overview

### Tech Stack

| Layer      | Technology                | Reason                                           |
| ---------- | ------------------------- | ------------------------------------------------ |
| Framework  | Nuxt 4 (SSR)              | SSR + Nitro server routes in one project         |
| UI         | Vue 3 + Headless UI       | Accessible components without style lock-in      |
| Styling    | Tailwind CSS + SCSS       | Utility-first with `@apply` for clean templates  |
| Validation | Zod v4                    | Type-safe schema validation                      |
| State      | Pinia + persistedstate    | Lightweight, Vue-native, session persistence     |
| Search     | Fuse.js (server-side)     | Fuzzy search without client bundle cost          |
| Testing    | Vitest + @nuxt/test-utils | Two environments: unit (Node) + component (Nuxt) |

### Project Structure

```
.
├── app/
│   ├── assets/
│   │   ├── icons/              # Custom SVG icon collection (tva: prefix)
│   │   │   ├── checkcircle.svg
│   │   │   ├── checklist.svg
│   │   │   ├── globe.svg
│   │   │   └── wizard.svg
│   │   ├── styles/
│   │   │   └── global.scss     # Global styles
│   │   └── theme/
│   │       └── theme.ts        # Tailwind design tokens
│   ├── components/
│   │   ├── submissions/
│   │   │   └── SubmissionList.vue
│   │   └── wizard/
│   │       ├── steps/
│   │       │   ├── components/ # Step sub-components (explicitly imported)
│   │       │   │   ├── BaseInput.vue
│   │       │   │   ├── ComboboxOpenStateWatch.vue
│   │       │   │   ├── CountryCombobox.vue
│   │       │   │   ├── CountrySelect.vue
│   │       │   │   ├── DatePicker.vue
│   │       │   │   ├── PhoneInput.vue
│   │       │   │   └── StepFooter.vue
│   │       │   ├── GeographyStep.vue
│   │       │   ├── IdentityStep.vue
│   │       │   └── VerificationStep.vue
│   │       ├── WizardMain.vue
│   │       ├── WizardStepper.vue
│   │       └── WizardSteps.vue
│   ├── composables/
│   │   ├── useCountrySelect.ts # Pagination, search, lazy load, exclude filter
│   │   └── useZodForm.ts       # Generic Zod-based form validation
│   ├── layouts/
│   │   └── default.vue
│   ├── pages/
│   │   └── index.vue
│   ├── stores/
│   │   ├── submissions.ts      # Submitted applications (persisted)
│   │   └── wizard.ts           # Step data and navigation state
│   ├── utils/
│   │   └── debounce.ts         # Explicitly imported — mockable in tests
│   └── app.vue
├── server/
│   └── api/
│       └── countries.get.ts    # Proxy + two-layer cache + fuzzy fallback
├── shared/
│   ├── constants.ts            # FETCH_LIMIT, PAGE_LIMIT, RESPONSE_FIELDS
│   ├── enums.ts                # SubmissionStatus
│   └── types/
│       ├── country.d.ts        # Country, CountryOption interfaces
│       ├── paginated.d.ts      # Paginated<T> generic
│       ├── submission.d.ts     # Submission (ambient, extends WizardData)
│       └── wizard.d.ts         # WizardData (ambient)
├── test/
│   ├── nuxt/
│   │   └── geographyStep.test.ts
│   └── unit/
│       └── useZodForm.test.ts
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── Dockerfile
├── .dockerignore
├── .env.example
├── nuxt.config.ts
├── tailwind.config.js
└── vitest.config.ts
```

### Data Flow

```
User types in CountrySelect
        │
        ▼
useCountrySelect.searchCountries(q)     ← debounced 300ms per instance
        │
        ▼
GET /api/countries?q=...&limit=20&offset=0
        │
        ▼
server/api/countries.get.ts
        │
        ├─ fetchCountriesBatch(batchOffset, search)   ← defineCachedFunction
        │         │
        │         └─ $fetch restcountries v5 API      ← only if not cached
        │                   (cached 1hr per search term + batch)
        │
        ├─ slice(localOffset, localOffset + clientLimit)
        │
        └─ if empty → fuzzySearch()                   ← Fuse.js on cached data
                │
                └─ useStorage('cache') → all cached batches → Fuse.search(q)
        │
        ▼
CountryOption[] returned to client
        │
        ▼
useCountrySelect.onResponse → countries.value updated
        │
        ▼
CountryCombobox renders list
```

---

## 🧠 Key Decisions

### API & Caching Strategy

> **The constraint:** RestCountries v5 free tier allows only **500 requests/month** — making efficient caching not optional but mandatory.

The solution is a **two-layer caching strategy**:

**Layer 1 — `defineCachedFunction`** caches full batches of 100 countries from restcountries by search term and batch offset. The cache key is `countries-{search}-batch-{offset}`, so the same search term at the same pagination point is never fetched twice within the 1-hour TTL.

**Layer 2 — Client `useFetch`** with `getCachedData: () => undefined` intentionally disables client-side caching. This is deliberate — we manage our own `countries` array by appending pages, so `useFetch`'s built-in cache would cause stale data and pagination bugs.

```
restcountries API (500 req/month)
        ↑ only on cache miss
defineCachedFunction (1hr TTL, per search+batch)
        ↑ always
/api/countries (slices cached data, no cache)
        ↑ per user request
useCountrySelect (client, appends pages)
```

**Why `immediate: false` everywhere:**

The intended architecture was `immediate: true` with SSR — country data would arrive pre-rendered with the initial HTML payload via Nuxt's payload transfer, eliminating all client-side loading states. This was blocked by a Nuxt context propagation bug when `useFetch` is called inside a composable. `createUseFetch` was also attempted but caused an infinite loop. The workaround is `immediate: false` with manual `lazyLoad()` calls per component.

> See [Known Limitations](#-known-limitations--trade-offs) for full details.

### Server Route Proxy

All restcountries API calls go through `server/api/countries.get.ts` — never directly from the client. This means:

- **API key never reaches the browser** — stored in `runtimeConfig` (server-only), injected via Vercel environment variables in production
- **Single contract point** — if restcountries changes their API shape, one server file handles it
- **Normalization in one place** — raw `Country` → lean `CountryOption` mapping happens server-side, components never touch raw API data

### Pagination Architecture

The client sends `limit=20&offset=N` per page. The server fetches batches of 100 from restcountries and slices server-side:

| Client offset | Server batch       | Local slice |
| ------------- | ------------------ | ----------- |
| 0             | batch-0 (0–99)     | [0:20]      |
| 20            | batch-0 (cached)   | [20:40]     |
| 40            | batch-0 (cached)   | [40:60]     |
| 60            | batch-0 (cached)   | [60:80]     |
| 80            | batch-0 (cached)   | [80:100]    |
| 100           | batch-1 (new call) | [0:20]      |

`PAGE_LIMIT` (20) is defined once in `shared/constants` and imported by both the composable and the server route — single source of truth for the pagination contract.

<details>
<summary>Why PAGE_LIMIT is a constant, not a prop</summary>

`PAGE_LIMIT` is intentionally not configurable via props. Pagination page size is a UX and performance contract — not a per-instance configuration concern. Making it a prop would imply consumers should think about it, when in reality it's an internal architectural decision. In a real project, this would be a backend-agreed value. See `shared/constants/index.ts`.

</details>

### Fuzzy Search

Server-side Fuse.js fallback — no client bundle cost:

1. Server searches restcountries with `q` param
2. If results are empty, `fuzzySearch()` runs Fuse.js across **all currently cached unfiltered batches** via `useStorage('cache')`
3. No additional restcountries API calls — only reads from Nitro's memory cache

A **singleton Fuse instance** is maintained at module scope and rebuilt hourly (matching cache TTL) to avoid recreating the index on every fuzzy request.

```
threshold: 0.4, ignoreLocation: true, keys: ['name']
```

> "albana" → Albania ✓ | "germny" → Germany ✓ | "frannce" → France ✓

### Component Architecture

**All components use explicit imports** — no Nuxt auto-import for components:

```ts
import CountrySelect from "@c/wizard/steps/components/CountrySelect.vue";
```

**Why:** Nuxt's component auto-import rules can change between versions. A version bump silently breaking all component resolution is a worse failure mode than writing import statements. Explicit imports also make dependencies immediately visible, provide reliable IDE go-to-definition, and make the project portable outside Nuxt.

> Composables and utils still use auto-imports — those are stable Vue conventions unlikely to change.

**Smart vs dumb component split:**

- `CountrySelect` — smart, owns `useCountrySelect`, manages fetch state
- `CountryCombobox` — dumb, purely presentational, receives data via props, emits events up
- `PhoneInput` — smart, owns its own `useCountrySelect` instance (lazy), pre-seeded from citizenship

Each `CountrySelect` and `PhoneInput` gets its **own `useCountrySelect` instance** with an independent debounce closure — rapid typing in one dropdown never interferes with the other's pending timer.

### Form Validation

`useZodForm` is a generic composable wrapping Zod v4:

- **`touched` state** prevents errors surfacing before user interaction
- **`validateField`** is debounced at the composable level — components don't need to think about it
- **`touched[field] = true`** is set **outside** the debounce so fields are marked immediately on interaction, even before the debounced validation fires
- `z.flattenError()` replaces deprecated `flatten()` and `format()` from Zod v3
- `z.custom<CountryOption>()` is used in step schemas instead of re-declaring the full country shape — we trust data from our own API

### State Management

Pinia is used for two stores:

| Store                | Purpose                                                    | Persisted                        |
| -------------------- | ---------------------------------------------------------- | -------------------------------- |
| `useWizardStore`     | Current step, form data across steps, navigation direction | ❌ Session only                  |
| `useSubmissionStore` | Submitted applications list                                | ✅ `pinia-plugin-persistedstate` |

A **client-side country cache store** was considered to deduplicate the initial `/api/countries` calls across the two `CountrySelect` instances and `PhoneInput`. It was intentionally rejected — `defineCachedEventHandler` already absorbs the restcountries quota concern server-side, and adding a store purely for client-side deduplication would be premature optimization that adds complexity without meaningful benefit.

### Styling Approach

Tailwind CSS with `theme.extend` (not `theme` replace) so default utilities remain available alongside custom design tokens.

**`@apply` in scoped `<style>` blocks** keeps templates clean without affecting performance — `@apply` is a build-time PostCSS transformation with zero runtime cost:

```vue
<template>
  <div class="wizard-card">...</div>
  <!-- semantic, readable -->
</template>

<style scoped lang="scss">
.wizard-card {
  @apply bg-white rounded-2xl shadow-elevation-3 p-8;  <!-- composed here -->
}
</style>
```

**BEM-inspired naming** with `jw-vw-` prefix (`jw` = project initials, `vw` = visa wizard) prevents collisions and makes component origin obvious at a glance.

Design tokens live in `app/assets/theme/theme.ts` — a plain TS object imported by `tailwind.config.ts`. Zero runtime cost, shareable with any TS logic that needs the same tokens.

### Code Style

- **Template-first SFC ordering** (`<template>` → `<script>` → `<style>`) — deviates from the Vue ecosystem's more common script-first convention. The template represents what the component _is_ from a consumer's perspective and should be the first thing you see.
- **`??` over `||`** for null coalescing throughout — `||` treats `0` and `''` as falsy which is rarely the intended behavior in form data
- **No `as` casting** unless genuinely unavoidable (Vue's `reactive()` return type, `Object.keys()` widening) — data is handled and guarded rather than types being silenced

### Testing Strategy

Two test environments via `@nuxt/test-utils`:

| Environment | Used for                     | Location     |
| ----------- | ---------------------------- | ------------ |
| `node`      | Pure logic composables       | `test/unit/` |
| `nuxt`      | Components with Nuxt context | `test/nuxt/` |

**`useZodForm`** — 22 unit tests covering initial state, validation, touched behavior, debounce timing, `getError`, and reset. Uses `vi.useFakeTimers()` to control debounce without real waiting.

**`GeographyStep`** — component tests using `mountSuspended`, `mockNuxtImport` for store mocking, and `mockComponent` for stubbing `CountrySelect` and `StepFooter` to avoid HTTP calls in tests.

`debounce` is explicitly imported from `~/app/utils/debounce` in `useZodForm` rather than relying on Nuxt auto-import — this makes it mockable in the plain Node test environment.

### Docker

Three-stage multi-stage build:

```
deps    → npm ci --omit=dev         (production deps only, cached layer)
builder → npm ci + npm run build    (full deps + Nuxt build → .output/)
runner  → node .output/server/index.mjs  (zero source, zero devDeps)
```

**Key details:**

- `node:22-alpine` base (~50MB vs ~900MB for Debian node)
- `COPY package.json package-lock.json` before `COPY .` — Docker layer caching means dependency installation is skipped on code-only changes
- Non-root `nuxt` user for security
- `HOST=0.0.0.0` required — Nitro defaults to `localhost` which is unreachable from outside the container
- `--env-file .env` at runtime — API keys are never baked into the image

> Note: the Fuse.js singleton doesn't persist between cold starts on Vercel serverless. On a persistent Node server (Railway, Fly.io, VPS) it works as intended. See [Known Limitations](#-known-limitations--trade-offs).

---

## 🔐 Environment Variables

| Variable   | Description                   | Required |
| ---------- | ----------------------------- | -------- |
| `BASE_URL` | RestCountries v5 API base URL | ✅       |
| `API_KEY`  | RestCountries v5 bearer token | ✅       |

Both are **server-only** (`runtimeConfig`, not `runtimeConfig.public`) — never sent to the client bundle.

**Local development:** copy `.env.example` to `.env` and fill in values.

**Production (Vercel):** add via Project → Settings → Environment Variables. Vercel injects them at build and runtime — no `.env` file needed on the server.

---

## 🧪 Running Tests

```bash
# Run all tests
npm run test

# Run unit tests only (fast, no Nuxt context)
npm run test -- --project unit

# Run component tests only
npm run test -- --project nuxt

# With coverage
npm run test -- --coverage
```

---

## 🚀 Deployment

This project is deployed on **Vercel** via automatic Git integration.

**To deploy your own:**

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables in Project → Settings → Environment Variables
4. Deploy — Vercel detects Nuxt automatically

**To deploy with Docker** (any Node-capable host):

```bash
docker build -t visa-wizard .
docker run -p 3000:3000 \
  -e BASE_URL=https://api.restcountries.com/countries/v5 \
  -e API_KEY=your_key_here \
  visa-wizard
```

---

## ⚠️ Known Limitations & Trade-offs

<details>
<summary>SSR prefetch blocked by Nuxt context bug</summary>

**Intended:** `immediate: true` in `useCountrySelect` so `useFetch` fires during SSR, country data arrives pre-rendered with the initial HTML payload via Nuxt's data transfer mechanism — zero client-side loading states.

**Blocked by:** A Nuxt context propagation issue where `useFetch` called inside a composable function body loses the Nuxt instance during SSR hydration. `createUseFetch` was attempted as an alternative but caused an infinite re-render loop in this specific setup. `asyncContext: true` (experimental) was also evaluated but has a known bug where `useRoute()` returns stale data after client-side navigation.

**Current workaround:** `immediate: false` with manual `lazyLoad()` calls. `CountrySelect` loads on mount, `PhoneInput` loads on first dropdown open.

</details>

<details>
<summary>Fuse.js singleton on Vercel serverless</summary>

The Fuse.js instance is maintained at Node.js module scope and rebuilt hourly. On a persistent server (Railway, Fly.io, VPS with Docker) this works as intended — one instance serves all requests until the TTL expires.

On **Vercel's serverless** functions, module scope resets on cold starts. The singleton is effectively rebuilt on the first fuzzy search after each cold start. This is acceptable since the rebuild cost is negligible (~few ms for 250 countries) and fuzzy search is already a fallback path.

</details>

<details>
<summary>RestCountries free tier — 500 requests/month</summary>

The free API tier allows 500 requests/month. This sounds limiting but the two-layer cache strategy makes it nearly a non-issue in practice:

- `defineCachedFunction` caches full batches for 1 hour per unique search term
- Pagination (offsets 20, 40, 60, 80) hits the cache, not restcountries
- Fuzzy search reads from Nitro storage — zero API calls
- In production with real traffic, a Redis or CDN cache layer would replace Nitro's in-memory cache for persistence across restarts

</details>

<details>
<summary>PAGE_LIMIT as a constant vs configurable prop</summary>

`PAGE_LIMIT = 20` is intentionally not a prop on `useCountrySelect`. Making it configurable would imply consumers should decide it, when it's actually a fixed UX and performance contract between the composable and the server route. Both sides import from `shared/constants` — single source of truth. This is documented as a deliberate decision, not an oversight.

</details>

---

<div align="center">

Built with ❤️ as a frontend interview assignment · [Live Demo](https://visa-wizard.vercel.app)

</div>
