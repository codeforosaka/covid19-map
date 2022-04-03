require("dotenv").config();
const { TOKEN } = process.env;

var env = process.env.NODE_ENV || "development";
if (env === "development" || env === "test") {
  var API_URL = "http://localhost:3000";
} else {
  var API_URL = process.env.API_URL;
}

export default {
  ssr: "true", //or spa
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "大阪府ゴールドステッカーマップ",
    htmlAttrs: {
      lang: "ja"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/axios",
    [
      "@nuxtjs/google-gtag",
      {
        id: "G-9GEZKPR44Q",
        debug: true
      }
    ]
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, ctx) {
      config.node = {
        fs: "empty"
      };
    }
  },

  env: {
    TOKEN
  },

  serverMiddleware: ["~/api"],
  axios: {
    baseURL: API_URL
  }
};
