const moduleOptions = `<%= JSON.stringify(options) %>`
const logStyle =
  'background-color: #FFFFFF; padding: 2px 5px; border-radius: 5px; font-weight: bold; border: 1px solid #e8452c; color: #e8452c;'
export function log(...args) {
  const options = JSON.parse(moduleOptions)
  // eslint-disable-next-line no-console
  console.log('%c' + options.name, logStyle, ...args)
}
