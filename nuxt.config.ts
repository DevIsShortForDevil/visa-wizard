// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  app: {
    head: {
      title: "Visa Wizard",
      link: [{ rel: "icon", type: "image/svg", href: "/favicon.svg" }],
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/eslint",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/test-utils",
    "@nuxt/icon",
    "@nuxt/test-utils/module",
  ],
  icon: {
    customCollections: [
      {
        prefix: "tva",
        dir: "./app/assets/icons",
      },
    ],
  },
  // ESLint flat config setup
  eslint: {
    config: {
      stylistic: true, // Enables formatting rules (prettier alternative)
    },
  },
});
