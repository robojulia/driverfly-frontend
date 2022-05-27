module.exports = {
  // reactStrictMode: true,
  reloadOnPrerender: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    BASE_URL_API: process.env.BASE_URL_API,
    MAPBOX_API_KEY: process.env.MAPBOX_API_KEY,
  },
  i18n: {
    defaultLocale: "en-us",
    locales: [ "en-us" ]
  }
}
