module.exports = {
  swcMinify: false, // it should be false by default
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
    BASE_URL_API: process.env.BASE_URL_API,
    MAPBOX_API_KEY: process.env.MAPBOX_API_KEY,
    TWILIO_APP_NAME: process.env.TWILIO_APP_NAME,
    PHONE_INPUT_COUNTRY_ALLOWED: process.env.PHONE_INPUT_COUNTRY_ALLOWED,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
  },
  i18n: {
    defaultLocale: "en-us",
    locales: ["en-us"],
  },
};
