[![NPM Package][npm]][npm-url]
[![NPM Downloads][npm-downloads-per-month]][npm-trends]
![Geins][mit-shield]

[![Start Geins Free Trial][geins-tiral-img]][geins-tiral-url] [![Geins Docs][geins-docs-img]][geins-docs-url]

[![geins](https://raw.githubusercontent.com/geins-io/resources/master/images/banners/repos/gtm.jpg)](https://www.geins.io)


# Google Tag Manager module for Geins PWA Storefront

Add google tag manager to your Geins PWA Storefront. A wrapper around the [nuxt-gtm](https://github.com/nuxt-community/gtm-module) module.

## Pre-requisites

- Geins Account and PWA Storefront Ralph. [Get a free trial here](https://www.geins.io)
- Storefront with `@ralph/ralph-ui` 19.4.0 or higher.

## Installation

### 1. Install the module

```bash
npm i @geins/ralph-module-gtm
```

### 2. Add the module to your Geins PWA Storefront Ralph

Add the module to your Geins PWA Storefront Ralph by adding the following lines to your `nuxt.config.json` file:

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

### Events

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


## Note

Since this module is based on the `[@nuxtjs/gtm](https://github.com/nuxt-community/gtm-module)` module, it will conflict with it.

If you are already using the `@nuxtjs/gtm` module, you should uninstall it and use this module instead, which will include the `@nuxtjs/gtm` module as a dependency. If you are using the internal GTM events of Ralph, you should disable them by setting `useExternalGtm` to true in the `publicRuntimeConfig` of you nuxt.config.js file.


[npm]: https://img.shields.io/npm/v/@geins/ralph-module-gtm
[npm-url]: https://www.npmjs.com/package/@geins/ralph-module-gtm
[npm-downloads-per-month]: https://img.shields.io/npm/dm/@geins/ralph-module-gtm.svg
[npm-trends]: https://npmtrends.com/@geins/ralph-module-gtm
[geins-docs-url]: https://docs.geins.io
[geins-docs-img]: https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/geins-io/resources/master/sheilds/geins-docs-read-v3.json
[geins-tiral-url]: https://www.geins.io
[geins-tiral-img]: https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/geins-io/resources/master/sheilds/geins-fee-tiral.json
[mit-shield]: https://img.shields.io/badge/license-MIT-green
[mit-url]: https://en.wikipedia.org/wiki/MIT_License

