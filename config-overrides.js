const path = require('path');

module.exports = function override(config) {
  // Define the alias for the 'src' directory
  config.resolve.alias['@'] = path.resolve(__dirname, 'src');
  return config;
};
