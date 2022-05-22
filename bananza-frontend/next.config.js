/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental:{
    images:{
      layoutRaw:true
    }
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
