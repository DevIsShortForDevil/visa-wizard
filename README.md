# TVA Application Wizard

A robust, multi-step Vue.js application built with Nuxt 3. This project features a multi-stage wizard with complex form validation, fuzzy searching, API integration, and persistent state management.

## 🚀 Live Demo

**[https://visa-wizard.vercel.app/](https://visa-wizard.vercel.app/)**

---

## 🛠 Tech Stack

- **Framework:** [Nuxt 3](https://nuxt.com/) / [Vue 3](https://vuejs.org/) (Composition API)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Pinia](https://pinia.vuejs.org/) + `pinia-plugin-persistedstate`
- **Validation:** [Zod](https://zod.dev/)
- **Search / Data:** [Fuse.js](https://fusejs.io/) (Fuzzy search), [RestCountries API](https://restcountries.com/)
- **Testing:** [Vitest](https://vitest.dev/), Vue Test Utils, `@nuxt/test-utils`
- **Deployment:** [Vercel](https://vercel.com/)

---

## 💻 Setup and Installation

This project uses `pnpm` as the package manager.

### 1. Clone the repository

```bash
git clone https://github.com/DevIsShortForDevil/visa-wizard.git
cd visa-wizard
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Run the development server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### 4. Run Unit Tests

```bash
# Run tests once
pnpm test

# Run tests in watch mode (for active development)
pnpm run test:watch
```

## 🏗 Key Architecture Decisions

### 1. Custom Zod Validation Composable (`useZodForm`)

Instead of relying on heavy form libraries like VeeValidate, I built a custom, lightweight composable (`useZodForm`) powered by **Zod**. This provides strict, type-safe schema validation while maintaining absolute control over field-level "touched" states, allowing for quiet validation on the fly and full validation on submit.

### 2. Centralized & Persisted State (Pinia)

The wizard handles complex, multi-step data. **Pinia** is used to centralize the state, abstracting the business logic (like navigating between steps and saving submissions) out of the UI components.

- To ensure a seamless user experience, `pinia-plugin-persistedstate` is utilized. If a user refreshes the page mid-application, their progress is safely restored from the session state.

### 3. Dynamic Component Routing with Transitions

Rather than relying on Nuxt's page router for wizard steps (which can cause unwanted page reloads or URL clutter), the wizard uses Vue's `<component :is="...">` pattern.

- Steps are dynamically injected into a single view.

- The Pinia store tracks the navigation direction (forward/backward) and dynamically applies CSS `<Transition>` classes (`slide-left` / `slide-right`) to create a native, app-like sliding animation.

### 4. Asynchronous Data Handling & Caching

The application fetches live data from the RestCountries API. To prevent layout shifts and optimize performance, Nuxt's ``useAsyncData` (or `useFetch`) is utilized. This ensures the data is fetched securely, cached, and made available to the DOM before the transition animations trigger.

### 5. Advanced Nuxt Testing Strategy

Testing Nuxt 3 components that rely on auto-imports (`useAsyncData`, `useWizardStore`) and asynchronous `<script setup>` tags can be challenging.

- The testing architecture utilizes `@nuxt/test-utils/runtime`.

- `mountSuspended` is used to perfectly resolve Vue's async boundaries without throwing empty wrapper errors.

- `mockNuxtImport` is used to surgically mock Pinia stores and API fetches without fighting Vite's import analysis.

### 6. Edge-Ready Serverless Deployment (Vercel)

The application is deployed to Vercel utilizing Nuxt's Nitro engine. To prevent SSR crashes common with heavily bundled client libraries (e.g., Vue Datepicker), the `nuxt.config.ts` specifically dictates Vite to inline dependencies (`vite.ssr.noExternal`) and transpile them. This ensures zero "legacy CommonJS" errors when running in strict Node.js serverless environments.
