/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash:true,
  images: {
    unoptimized: true,
    domains: ['https://thumbs.dreamstime.com']
  },
}

module.exports = nextConfig
