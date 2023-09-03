import CryptoJS from 'crypto-js'
const moduleOptions = `<%= JSON.stringify(options) %>`

export default function(app, inject) {
  const options = JSON.parse(moduleOptions)
  inject(options.name, options)

  let productImpressions = []
  let ecommerce = {}

  // Function to push product impressions to the data layer in batches
  const pushProductImpressions = () => {
    if (productImpressions.length > 0) {
      ecommerce.items = productImpressions

      resetDataLayer()
      app.$gtm.push({
        event: 'view_item_list',
        ecommerce
      })

      // Clear the product impressions array
      productImpressions = []
    }
  }

  if (process.client) {
    window.onNuxtReady(() => {
      window.addEventListener('beforeunload', () => {
        pushProductImpressions()
      })
    })
  }

  const splitDiscount = (items, discount) => {
    let groupDiscount = discount
    let groupPrice = items.reduce((sum, ci) => sum + ci.price, 0)
    let totalDiscount = 0

    items?.map(cartItem => {
      let ratio = cartItem.price / groupPrice
      let discountSum = Math.round(groupDiscount * ratio * 100) / 100
      cartItem.price = Math.round((cartItem.price - discountSum) * 100) / 100

      if (cartItem.discount != null) {
        cartItem.discount += discountSum
      }

      totalDiscount += discountSum
      return cartItem
    })

    let rounding = Math.round((groupDiscount - totalDiscount) * 100) / 100

    if (rounding !== 0) {
      items[0].price -= rounding
      items[0].discount += rounding
    }

    return items
  }

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

  const getItem = (product, skuItem = null, index = 1) => {
    const variant = getItemVariant(product) || String(skuItem?.skuId) || ''
    const price = skuItem?.unitPrice || product.unitPrice
    const discount = price?.regularPriceIncVat - price?.sellingPriceIncVat

    let item = {
      item_name: product.name,
      item_id: product[options.itemId],
      price: price?.sellingPriceIncVat,
      price_campaign: product.discountType === 'PRICE_CAMPAIGN',
      item_brand: product.brand?.name,
      item_category: product.primaryCategory?.name,
      // item_category2: item_category2,
      // item_category2: item_category3,
      // item_category4: item_category4,
      item_variant: variant,
      // item_list_name: list_name,
      // item_list_id: list_id,
      index: index,
      quantity: skuItem?.quantity || 1,
      sales_type: getSalesCategory(price?.discountPercentage)
      // customer_segmentation: customer_category
    }

    if (!Number.isNaN(discount)) {
      item.discount = Math.max(0, discount)
    }

    item = overrideProps(item)

    return item
  }

  const getItemVariant = product => {
    const group = product?.parameterGroups?.find(
      group => group?.parameterGroupId === 1
    )
    const parameter = group?.parameters?.find(p => p.name === 'Color')
    return parameter?.value || ''
  }

  const overrideProps = obj => {
    options.propOverrides.forEach(prop => {
      const value = obj[prop.override]
      if (!value) {
        return
      }
      delete obj[prop.override]
      obj[prop.name] = value
    })
    return obj
  }

  const resetDataLayer = () => {
    app.$gtm.push({ ecommerce: null })
  }

  // Listen to events in ralph and take action
  app.store.subscribe((mutation, state) => {
    if (mutation.type === 'events/push') {
      const eventType = mutation.payload.type
      const eventData = mutation.payload.data
      ecommerce.currency = state.channel.currentCurrency

      let product = eventData.product ?? null

      // ADD TO CART / REMOVE FROM CART
      // --------------------------------
      if (eventType.includes('cart')) {
        ecommerce.items = [getItem(product, eventData.item)]

        const event =
          eventType.split(':')[1] === 'add' ? 'add_to' : 'remove_from'

        resetDataLayer()
        app.$gtm.push({
          event: `${event}_cart`,
          ecommerce
        })
      }

      // PRODUCT IMPRESSIONS / VIEW ITEM LIST
      // ------------------------------------
      if (eventType === 'product:impression') {
        const item = getItem(product, null, eventData.index)
        productImpressions.push(item)

        // Check if the batch size limit is reached and push group
        if (productImpressions.length >= 4) {
          pushProductImpressions()
        }
      } else {
        // If other event, push leftovers if any
        pushProductImpressions()
      }

      // PRODUCT CLICK / SELECT ITEM
      // ---------------------------
      if (eventType === 'product:click') {
        ecommerce.items = [getItem(product, null, eventData.index)]

        resetDataLayer()
        app.$gtm.push({
          event: 'select_item',
          ecommerce
        })
      }

      // PRODUCT DETAIL IMPRESSION / VIEW ITEM
      // -------------------------------------
      if (eventType === 'product-detail:impression') {
        ecommerce.items = [getItem(product)]

        resetDataLayer()
        app.$gtm.push({
          event: 'view_item',
          ecommerce
        })
      }

      // CHECKOUT IMPRESSION / BEGIN CHECKOUT
      // ------------------------------------
      if (eventType === 'checkout:impression') {
        const cartItems =
          state?.cart?.data?.items?.map(item => {
            return getItem(item.product, item)
          }) || []

        ecommerce.items = cartItems

        resetDataLayer()
        app.$gtm.push({
          event: 'begin_checkout',
          ecommerce
        })
      }

      // PAGE IMPRESSION
      // ---------------
      if (eventType === 'page:impression') {
        app.$gtm.push({
          event: 'page_data',
          page_type: eventData.route?.meta[0]?.pageType
        })

        if (eventData.isSSR) {
          app.$gtm.push({
            event: 'original_location',
            original_location: eventData.requestUrl
          })
        } else {
          app.$gtm.push({
            event: 'virtual_page_view',
            pagePath: eventData.route.fullPath
          })
        }
      }

      // ADD FAVORITE
      // ------------
      if (eventType === 'favorite:add') {
        const item = getItem(product)
        ecommerce.items = [item]

        resetDataLayer()
        app.$gtm.push({
          event: 'add_to_wishlist',
          ecommerce
        })
      }

      // TRANSACTION / PURCHASE
      // ----------------------
      if (eventType === 'checkout:purchase') {
        const email = eventData.order?.email?.toLowerCase().trim()
        const hashedEmail = CryptoJS.SHA256(email).toString()

        ecommerce = {
          transaction_id: eventData.order?.orderId,
          currency: eventData.order?.currency,
          value: eventData.orderCart?.summary.total.sellingPriceIncVat,
          value_ex_tax: eventData.orderCart?.summary.total.sellingPriceExVat,
          value_tax: eventData.orderCart?.summary.total.vat,
          items_value: eventData.order?.itemValueIncVat,
          items_value_ex_tax: eventData.order?.itemValueExVat,
          items_tax:
            eventData.order?.itemValueIncVat - eventData.order?.itemValueExVat,
          shipping: eventData.orderCart?.summary.shipping.feeIncVat,
          shipping_ex_tax: eventData.orderCart?.summary.shipping.feeExVat,
          coupon: eventData.orderCart?.promoCode,
          user_id: hashedEmail,
          total_discount: eventData.orderCart?.summary.total.discountIncVat,
          nth_purchase: eventData?.nthPurchase || 1
        }

        const fixedAmountDiscount =
          eventData.orderCart?.summary?.fixedAmountDiscountIncVat
        const fixedAmountDiscountExVat =
          eventData.orderCart?.summary?.fixedAmountDiscountExVat

        if (fixedAmountDiscount > 0) {
          ecommerce.items_value = ecommerce.items_value - fixedAmountDiscount
          ecommerce.items_value_ex_tax =
            ecommerce.items_value_ex_tax - fixedAmountDiscountExVat
          ecommerce.items_tax =
            ecommerce.items_tax -
            (fixedAmountDiscount - fixedAmountDiscountExVat)
        }

        ecommerce = overrideProps(ecommerce)

        let cartItems =
          eventData.orderCart?.items?.map(item => {
            return getItem(item.product, item)
          }) || []

        if (fixedAmountDiscount > 0) {
          cartItems = splitDiscount(cartItems, fixedAmountDiscount)
        }

        ecommerce.items = cartItems

        resetDataLayer()
        app.$gtm.push({
          event: 'purchase',
          ecommerce
        })
      }

      // All events sent by ralph since version 19.3.0
      // ------------------------------------------------
      // `product:impression` - data payload: `{ product, page, index, pageSize }` (changed payload)

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
