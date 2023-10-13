const path = require('path')

const moduleName = 'ralphGTM'

const defaults = {
  name: moduleName,
  debug: false,
  enabled: true,
  gtm: {},
  itemId: 'productId',
  propOverrides: []
}

module.exports = async function(moduleOptions) {
  const options = {
    ...defaults,
    ...this.options[moduleName],
    ...moduleOptions
  }

  options.gtm.autoInit = false

  if (!options.enabled) {
    return false
  }

  this.addTemplate({
    src: path.resolve(__dirname, 'module.utils.js'),
    fileName: `${moduleName}.utils.js`,
    options
  })

  this.addPlugin({
    src: path.resolve(__dirname, 'module.plugin.js'),
    fileName: `${moduleName}.plugin.js`,
    options
  })

  this.requireModule(['@nuxtjs/gtm', options.gtm])

  return true
}
module.exports.meta = require('../package.json')
