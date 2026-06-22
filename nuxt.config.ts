// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  future: {
    compatibilityVersion: 4,
  },

  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  vite: {
    ssr: {
      // This forces Vite to bundle these directly into the server build
      // so Vercel doesn't trip over legacy imports.
      noExternal: ["@vuepic/vue-datepicker"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
  },
  app: {
    head: {
      title: "JW-Visa-Wizard",
      link: [{ rel: "icon", type: "image/svg", href: "/favicon.svg" }],
    },
  },
  runtimeConfig: {
    apiKey: process.env.API_KEY,
    baseUrl: process.env.BASE_URL,
  },

  nitro: {
    externals: {
      inline: ["fuse.js"],
    },
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],

  css: ["./app/assets/styles/global.scss"],

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
