const express = require('express');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'mantau-kopi-backend',
    timestamp: new Date().toISOString(),
  });
});

router.get('/bootstrap', (_req, res) => {
  res.json({
    appName: 'Mantau Kopi',
    frontend: {
      stack: 'React + Vite + PWA',
      roles: ['supervisor', 'rider'],
    },
    backend: {
      stack: 'Node.js + Express',
      apiBaseUrl: '/api',
    },
    notes: [
      'Frontend disiapkan ke arah PWA untuk operasional lapangan.',
      'Backend siap dikembangkan untuk auth, BWM-TOPSIS, POI, cuaca, dan log penjualan.',
    ],
  });
});

module.exports = router;
