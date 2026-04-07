/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  async rewrites() {
    return {
      beforeFiles: [
        {
          has: [{ type: 'host', value: 'admin.brevlomedia.com' }],
          source: '/(.*)',
          destination: '/admin.html',
        },
      ],
    };
  },
};

module.exports = nextConfig;
