const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/airr/v1/',
    createProxyMiddleware({
      target: process.env.REACT_APP_MIDDLEWARE_URL,
    })
  );

  app.use(
    '/auth',
    createProxyMiddleware({
      target: process.env.REACT_APP_KEYCLOAK_URL,
    })
  );

};