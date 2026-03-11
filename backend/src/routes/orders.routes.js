const express = require('express');
const ordersService = require('../services/orders.service');

const router = express.Router();

router.get('/', (req, res) => {
  const orders = ordersService.getActiveOrders();
  res.json(orders);
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  try {
    const updated = ordersService.updateOrderStatus(id, status);
    res.json(updated);
  } catch (err) {
    if (err.code === 'INVALID_TRANSITION') {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === 'NOT_FOUND') {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
