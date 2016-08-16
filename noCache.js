const noCache = (req, res, next) => {
  res.setHeader('cache-control',
    'private, max-age=0, no-cache, no-store, must-revalidate');
  res.setHeader('expires', '0');
  res.setHeader('pragma', 'no-cache');
  next();
}
module.exports = noCache;
