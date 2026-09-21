/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')()

module.exports = withNextIntl({
  output: 'standalone',
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
