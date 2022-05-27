module.exports = {
  target: "serverless",
  future: { webpack5: true },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      config.resolve.alias.canvas = false
      config.resolve.alias.encoding = false
      return config
  },
  reactStrictMode: true,
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
