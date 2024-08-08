const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Set CORS headers for all responses
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Proxy middleware to intercept and modify headers
const corsBypassProxy = createProxyMiddleware({
  target: 'https://metadata.services.blockscout.com',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.removeHeader('origin');
  },
  onProxyRes: (proxyRes, req, res) => {
    // Optionally set CORS headers again here if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }
});

// Use the proxy middleware
app.use('/', corsBypassProxy);

const PORT = 4040;
app.listen(PORT, () => {
  console.log(`CORS bypass proxy running on port ${PORT}`);
});
