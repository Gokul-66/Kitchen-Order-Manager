const express = require('express');
const ordersService = require('../services/orders.service');

const router = express.Router();

router.get('/', (req, res) => {
  const orders = ordersService.getActiveOrders();
  res.json(orders);
});

module.exports = router;
