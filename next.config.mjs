/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.100.12'],
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/services.html', destination: '/services', permanent: true },
      { source: '/realisations.html', destination: '/realisations', permanent: true },
      { source: '/blog.html', destination: '/blog', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/login.html', destination: '/login', permanent: true },
      { source: '/register.html', destination: '/register', permanent: true },
      { source: '/dashboard-admin.html', destination: '/dashboard/admin', permanent: true },
      { source: '/dashboard-client.html', destination: '/dashboard/client', permanent: true },
    ];
  },
};

export default nextConfig;
