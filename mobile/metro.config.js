const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = {
  ...config,
  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        return middleware(req, res, next);
      };
    },
  },
};
