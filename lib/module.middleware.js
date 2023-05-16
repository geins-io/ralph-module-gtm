export const createMiddleware = options => {
  return (req, res, next) => {
    // todo: add option to disable logging    
    console.log('middleware', req.url)
    next();
  }
}
