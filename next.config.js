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
    NEXT_PUBLIC_TWILIO_APP_NAME: process.env.NEXT_PUBLIC_TWILIO_APP_NAME,
    TWILIO_APP_NAME: process.env.NEXT_PUBLIC_TWILIO_APP_NAME,
    NEXT_PUBLIC_PHONE_INPUT_COUNTRY_ALLOWED: process.env.NEXT_PUBLIC_PHONE_INPUT_COUNTRY_ALLOWED,
    PHONE_INPUT_COUNTRY_ALLOWED: process.env.NEXT_PUBLIC_PHONE_INPUT_COUNTRY_ALLOWED,
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    NEXT_PUBLIC_MICROSOFT_CLARITY: process.env.NEXT_PUBLIC_MICROSOFT_CLARITY,
    NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
  },
  i18n: {
    defaultLocale: 'en-us',
    locales: ['en-us'],
  },
  webpack: (config, { webpack }) => {
    const path = require('path');
    // @react-pdf/renderer pulls in fontkit's ESM `.mjs` browser build; relax
    // strict ESM resolution for node_modules `.mjs` files.
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
      resolve: { fullySpecified: false },
    });
    // fontkit imports `@swc/helpers/_/x` subpaths that Next 12's webpack fails
    // to resolve via the package `exports` map. Rewrite those requests to the
    // real esm files before resolution (works regardless of importer file type,
    // unlike resolve.alias which the .mjs resolver bypasses here).
    const swcHelpersEsm = path.join(
      path.dirname(require.resolve('@swc/helpers/package.json')),
      'esm'
    );
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^@swc\/helpers\/_\/.+$/, (resource) => {
        const helper = resource.request.replace(/^@swc\/helpers\/_\//, '');
        resource.request = path.join(swcHelpersEsm, `${helper}.js`);
      })
    );
    return config;
  },
};
