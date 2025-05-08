/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')()

module.exports = withNextIntl({
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/nl/manage',
        destination: '/manage', // Redirect to a 404 page or any other page
        permanent: true, // Set to true if this is a permanent redirect
      },
    ]
  },
})
