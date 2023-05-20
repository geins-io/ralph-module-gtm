[![NPM Package][npm]][npm-url]
[![NPM Downloads][npm-downloads-per-month]][npm-trends]

# Ralph Module for GTM

GTM module for Ralph that will push the following events to the datalayer:

- `add_to_cart` - One or more products are added to the cart
- `remove_from_cart` - One or more products are removed from the cart
- `view_item` - A product page is viewed
- `view_item_list` - A product in a list is scrolled into view
- `select_item` - A product in a list is clicked
- `begin_checkout` - The checkout page has been entered
- `purchase` - A purchase has been made
- `original_location` - The page where the user enters the site
- `virtual_page_view` - A new navigation has been made
- `page_data` - A page has been loaded
- `add_to_wishlist` - A product has been added to the wishlist

## Requirements

This package require Nuxt 2 to be installed in your project. It also requires @ralph/ralph-ui 19.4.0 or higher.

## Installation

```bash
npm install @geins/ralph-module-gtm
```

## Usage

Once installed, you can add the module to your Nuxt 2 app by updating the modules array in the nuxt.config.js file. You can then configure the module by adding options to the `@geins/ralph-module-gtm` object:

```javascript
// nuxt.config.js

module.exports = {
  modules: [
    [
      '@geins/ralph-module-gtm',
      // Configuration defaults for the module
      {
        // Set to true to enable debug mode
        debug: false,
        // Set to false to disable the module
        enabled: true,
        // Settings for the GTM module, see https://github.com/nuxt-community/gtm-module for more information
        gtm: {},
        // What to use as the item_id for the product, for example 'productId' or 'articleNumber'
        itemId: 'productId',
        // If you want to override some properties of the product, you can do so here , for example: [{ override: 'price_campaign', name: 'green_price' }]
        propOverrides: []
      }
    ]
  ]
}
```

## License

MIT

## Note

If you are already using the `@nuxtjs/gtm` module, you should uninstall it and use this module instead, which will include the `@nuxtjs/gtm` module as a dependency. If you are using the internal GTM events of Ralph, you should disable them by setting `useExternalGtm` to true in the `publicRuntimeConfig` of you nuxt.config.js file.

[npm]: https://img.shields.io/npm/v/@geins/ralph-module-gtm
[npm-url]: https://www.npmjs.com/package/@geins/ralph-module-gtm
[npm-downloads-per-month]: https://img.shields.io/npm/dm/@geins/ralph-module-gtm.svg
[npm-trends]: https://npmtrends.com/@geins/ralph-module-gtm
