const fs = require('fs');
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const favicon = require('serve-favicon');
var compression = require('compression');

const envPath = path.join(process.cwd(), './.env');
require('dotenv').config({ path: envPath });

const { PORT, PROXY_URL, CHECK_ROBOT } = process.env;
const app = express();

app.disable('x-powered-by');
app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(cors());
app.use(compression());
let proxyOptions = {
  changeOrigin: true,
  proxyTimeout: 30000,
};

app.use(
  '/api',
  createProxyMiddleware({ target: PROXY_URL || 'http://localhost:8000', ...proxyOptions, pathRewrite: { '^/api': '' }}),
);


app.use('/health/readiness', (req, res) => {
  res.status(200).end('Ok');
});

app.use('/health/liveness', (req, res) => {
  res.status(200).end('Ok');
});


if (CHECK_ROBOT === 'true') {
  const robotTxt = fs.readFileSync(path.join(__dirname, './robots.txt'), 'utf-8');
  app.use('/robots.txt', (req, res) => {
    return res.send(robotTxt);
  });
}

const distDir = path.join(__dirname, '../dist');
const htmlTemplate = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
app.use(express.static(distDir));

app.use('/', (req, res) => {
  return res.send(htmlTemplate);
});

app.use((error, req, res) => {
  res.status(500);
  res.render('error', { error });
});

const port = PORT || 8000;
app.listen(port, () => {
  console.info(`Listened at http://localhost:${port}`);
});
