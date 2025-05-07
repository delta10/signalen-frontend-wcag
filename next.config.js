/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')()

module.exports = withNextIntl({
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/manage',
        destination: '/manage', // Redirect to a 404 page or any other page
        permanent: false, // Set to true if this is a permanent redirect
      },
    ]
  },
})
