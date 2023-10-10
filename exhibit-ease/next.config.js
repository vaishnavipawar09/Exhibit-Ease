/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    ...nextConfig,
    output: 'standalone',
    images: {
        domains: ['drive.google.com'],
        minimumCacheTTL: 1500000,
    },
};
