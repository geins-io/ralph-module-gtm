const moduleOptions = `<%= JSON.stringify(options) %>`

export default function(app, inject) {
  const options = JSON.parse(moduleOptions)
  inject(options.name, options)

  // Register Vuex store module for this module
  // app.store.registerModule(options.name, {
  //   state: () => ({}),
  //   mutations: {},
  //   actions: {},
  //   getters: {}
  // })

  const getSalesCategory = discountPercent => {
    if (discountPercent >= 0 && discountPercent <= 5) {
      return '0-5%'
    } else if (discountPercent >= 6 && discountPercent <= 10) {
      return '6-10%'
    } else if (discountPercent >= 11 && discountPercent <= 15) {
      return '11-15%'
    } else if (discountPercent >= 16 && discountPercent <= 20) {
      return '16-20%'
    } else if (discountPercent >= 21 && discountPercent <= 30) {
      return '21-30%'
    } else if (discountPercent >= 31 && discountPercent <= 40) {
      return '31-40%'
    } else if (discountPercent >= 41 && discountPercent <= 50) {
      return '41-50%'
    } else if (discountPercent >= 51 && discountPercent <= 60) {
      return '51-60%'
    } else if (discountPercent >= 61 && discountPercent <= 70) {
      return '61-70%'
    } else if (discountPercent >= 71 && discountPercent <= 80) {
      return '71-80%'
    } else if (discountPercent >= 81 && discountPercent <= 100) {
      return '81-100%'
    } else {
      return 'Invalid discount percentage'
    }
  }

  // Listen to events in ralph and take action
  app.store.subscribe((mutation, state) => {
    if (mutation.type === 'events/push') {
      const eventType = mutation.payload.type
      const eventData = mutation.payload.data

      if (eventType.includes('cart')) {
        const product = eventData.product
        console.log(product)
        const item = {
          item_name: product.name,
          item_id: product[options.itemId],
          price: product.unitPrice.sellingPriceIncVat,
          price_campaign: product.discountType === 'PRICE_CAMPAIGN',
          item_brand: product.brand.name,
          item_category: product.primaryCategory.name,
          // item_category2: item_category2,
          // item_category2: item_category3,
          // item_category4: item_category4,
          item_variant: eventData.item.skuId,
          // item_list_name: list_name,
          // item_list_id: list_id,
          index: product.index || 1,
          quantity: eventData.item.quantity,
          sales_type: getSalesCategory(product.unitPrice.discountPercentage)
          // customer_segmentation: customer_category
        }

        options.propOverrides.forEach(prop => {
          const value = item[prop.override]
          item[prop.name] = value
          delete item[prop.override]
        })

        const ecommerce = {
          currency: state.channel.currentCurrency,
          items: [item]
        }

        const event =
          eventType.split(':')[1] === 'add' ? 'add_to' : 'remove_from'

        app.$gtm.push({
          event: `${event}_cart`,
          ecommerce
        })
      }

      // All events sent by ralph since version 19.1.0
      // ------------------------------------------------
      // `widget:click` - data payload: `{ href }`
      // `menu:click` - data payload: `{ item }`
      // `search:click` - data payload: `{ type, data }`

      // All events sent by ralph since version 19.0.0
      // ------------------------------------------------
      // `cart:add` - data payload: `{ item, product }`
      // `cart:remove` - data payload: `{ item, product }`
      // `page:impression` - data payload: `{ route }`
      // `product:click` - data payload: `{ product, page, index, pageSize }`
      // `product:impression` - data payload: `{ product, page }`
      // `product-detail:impression` - data payload: `{ product }`
      // `favorite:add` - data payload: `{ productId, product }`
      // `favorite:remove` - data payload: `{ productId, product }`
      // `checkout:impression` - data payload: `{}`
      // `checkout:update` - data payload: `{ checkout }`
      // `checkout:purchase` - data payload: `{ order }`
      // `user:login` - data payload: `{}`
      // `user:logout` - data payload: `{}`
      // `user:register` - data payload: `{}`
      // `user:password-reset` - data payload: `{ email, resetKey }`
      // `user:delete` - data payload: `{}`
      // `newsletter:subscribe` - data payload: `{ email }`
    }
  })
}
