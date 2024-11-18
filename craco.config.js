/* craco.config.js */
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      // '@': path.resolve(__dirname, 'src/'),
      '@FormHMCompos': path.resolve(__dirname, 'src/handmade_compos/FormHMCompos/FormHMCompos'),
      '@TableHMCompos': path.resolve(__dirname, 'src/handmade_compos/TableHMCompos/TableHMCompos'),
      '@Pagination': path.resolve(__dirname, 'src/handmade_compos/Pagination/Pagination'),
      '@Components': path.resolve(__dirname, 'src/components/jsx/'),
      '@Layouts': path.resolve(__dirname, 'src/layouts/jsx/'),
      '@Pages': path.resolve(__dirname, 'src/pages/jsx/'),
      '@Services': path.resolve(__dirname, 'src/services/'),
    }
  },
};