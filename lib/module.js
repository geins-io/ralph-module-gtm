const path = require('path')

// Import Mixins to export
// const { default: MyMixin } = require('./components/mixins/MyMixin')

// Change this to match your module name
const moduleName = 'ralphGTM'

const defaults = {
  name: moduleName,
  itemId: 'productId',
  propOverrides: []
}

module.exports = async function(moduleOptions) {
  const options = {
    ...defaults,
    ...this.options[moduleName],
    ...moduleOptions
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

  // Add Mixins
  // this.nuxt.hook('vue:extend', Component => {
  //   Component.mixin(MyMixin)
  // })

  /*
  this.nuxt.hook('components:dirs', (dirs) => {
    dirs.push({
      path: path.resolve(__dirname, 'components'),      
      prefix: 'my',
      extensions: ['vue']
    });
  });
  */

  /*
  this.nuxt.hook('components:dirs', (dirs) => {
    dirs.push({
      path: path.resolve(__dirname, 'components'),      
      prefix: 'my',
      extensions: ['js']
    });
  });
*/

  return true
}
module.exports.meta = require('../package.json')

// Export Mixins
// module.exports.MyMixin = MyMixin
