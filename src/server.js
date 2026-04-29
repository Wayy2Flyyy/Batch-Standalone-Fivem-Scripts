'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const healthRouter = require('./routes/health');
const scriptsRouter = require('./routes/scripts');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & utility middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
    },
  },
}));
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

// Static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use('/healthz', healthRouter);
app.use('/api/scripts', scriptsRouter);

// Catch-all: serve the SPA index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Global error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`[danielilli-scripts] Server running on http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`);
});

module.exports = { app, server };
