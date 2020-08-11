const path = require('path')

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set('@', path.join(__dirname, './src/'))
    config.resolve.alias.set('common', path.join(__dirname, './src/assets'))
  }
}
