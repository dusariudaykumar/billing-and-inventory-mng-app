/** @type {import('next').NextConfig} */
const {
  SITE_AUTHOR,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_URL,
  SITE_LOCALE,
  SITE_LOGO,
  SITE_TITLE,
  SITE_TYPE,
  MONGODB_URI,
  SITEMAP_URL,
  API_BASEURL,
} = process.env;
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    config.devtool = 'source-map';
    config.resolve.fallback = {
      fs: false,
      path: false,
    };
    return config;
  },
  env: {
    SITE_AUTHOR,
    SITE_NAME,
    SITE_DESCRIPTION,
    SITE_EMAIL,
    SITE_URL,
    SITE_LOCALE,
    SITE_LOGO,
    SITE_TITLE,
    SITE_TYPE,
    MONGODB_URI,
    SITEMAP_URL,
    API_BASEURL,
  },
};

module.exports = nextConfig;
