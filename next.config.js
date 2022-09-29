/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate')

const nextConfig = nextTranslate({
  reactStrictMode: false,
  images: {
    domains: ['cdn.rasta.app', 'test.cdn.rasta.app'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    SOURCE: 'website',
    PLATFORM_ID: '1822349b-94bd-4437-9b69-998df0916c40',
    REDUX_PERSIST_MIGRATION_VERSION: 1,
    COOKIE_TIME: 30 * 24 * 60 * 60,
  },
})

module.exports = nextConfig
