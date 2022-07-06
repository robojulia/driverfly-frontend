module.exports = {
  
  swcMinify: false, // it should be false by default 
  reactStrictMode: false,
  reloadOnPrerender: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    BASE_URL_API: process.env.BASE_URL_API,
    MAPBOX_API_KEY: process.env.MAPBOX_API_KEY,
    TWILIO_APP_NAME: process.env.TWILIO_APP_NAME,
  },
  i18n: {
    defaultLocale: "en-us",
    locales: [ "en-us" ]
  }
}
