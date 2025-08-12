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
    NEXT_PUBLIC_MICROSOFT_CLARITY: process.env.NEXT_PUBLIC_MICROSOFT_CLARITY,
  },
  i18n: {
    defaultLocale: "en-us",
    locales: ["en-us"],
  },
};


// Injected content via Sentry wizard below

// const { withSentryConfig } = require("@sentry/nextjs");

// export default withSentryConfig(
//   nextConfig,
//   {
//     // For all available options, see:
//     // https://github.com/getsentry/sentry-webpack-plugin#options

//     // Suppresses source map uploading logs during build
//     silent: true,
//     org: "komodal",
//     project: "driverfly",
//   },
//   {
//     // For all available options, see:
//     // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

//     // Upload a larger set of source maps for prettier stack traces (increases build time)
//     widenClientFileUpload: true,

//     // Transpiles SDK to be compatible with IE11 (increases bundle size)
//     transpileClientSDK: true,

//     // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
//     tunnelRoute: "/monitoring",

//     // Hides source maps from generated client bundles
//     hideSourceMaps: true,

//     // Automatically tree-shake Sentry logger statements to reduce bundle size
//     disableLogger: true,

//     // Enables automatic instrumentation of Vercel Cron Monitors.
//     // See the following for more information:
//     // https://docs.sentry.io/product/crons/
//     // https://vercel.com/docs/cron-jobs
//     automaticVercelMonitors: true,
//   }
// );
