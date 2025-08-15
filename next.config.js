module.exports = {
  swcMinify: false, // it should be false by default
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  env: {
    // Map to CI/CD-provided NEXT_PUBLIC_* variables so builds receive the correct values
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    FRONTEND_BASE_URL: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL,
    BASE_URL_API: process.env.BASE_URL_API,
    NEXT_PUBLIC_BASE_URL_API: process.env.NEXT_PUBLIC_BASE_URL_API, // For API calls
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL, // For base URL
    NEXT_PUBLIC_FRONTEND_BASE_URL: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL, // For frontend URL
    NEXT_PUBLIC_MAPBOX_API_KEY: process.env.NEXT_PUBLIC_MAPBOX_API_KEY, // For Mapbox
    MAPBOX_API_KEY: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
    TWILIO_APP_NAME: process.env.NEXT_PUBLIC_TWILIO_APP_NAME,
    PHONE_INPUT_COUNTRY_ALLOWED: process.env.NEXT_PUBLIC_PHONE_INPUT_COUNTRY_ALLOWED,
    RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    NEXT_PUBLIC_MICROSOFT_CLARITY: process.env.NEXT_PUBLIC_MICROSOFT_CLARITY,
    NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
  },
  i18n: {
    defaultLocale: 'en-us',
    locales: ['en-us'],
  },
};
