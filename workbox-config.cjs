module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,json,svg,png,ico,webp,woff2}'],
  globIgnores: ['sw.js', 'workbox-*.js'],
  swDest: 'dist/sw.js',
  clientsClaim: true,
  skipWaiting: true,
  cleanupOutdatedCaches: true,
  navigateFallback: '/index.html'
};
