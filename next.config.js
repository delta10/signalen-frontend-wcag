/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')()

module.exports = withNextIntl({
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: '/:locale/incident/beschrijf',
        destination: '/:locale/incident',
        permanent: true,
      },
    ]
  },
})
