const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    devServer: {
      host: '0.0.0.0',
      port: 19006,
      allowedHosts: 'all',
    },
  }, argv);
  
  // Override devServer settings
  if (config.devServer) {
    config.devServer.host = '0.0.0.0';
    config.devServer.allowedHosts = 'all';
  }
  
  return config;
};
