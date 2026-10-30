const express = require('express');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const openapi = require('./openapi');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json({ limit: '10kb' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
