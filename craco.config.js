const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // تنظیمات برای نسخه ادمین
      if (process.env.BUILD_TARGET === 'admin') {
        webpackConfig.entry = path.resolve(__dirname, 'src/adminIndex.js');
        webpackConfig.output.path = path.resolve(__dirname, 'admin-build');
      }
      return webpackConfig;
    },
  },
};