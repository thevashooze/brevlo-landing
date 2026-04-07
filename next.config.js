/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  async rewrites() {
    return {
      beforeFiles: [
        {
          has: [{ type: 'host', value: 'admin.brevlomedia.com' }],
          source: '/((?!.*\\.[a-zA-Z0-9]+$).*)',
          destination: '/admin.html',
        },
      ],
    };
  },
};

module.exports = nextConfig;
