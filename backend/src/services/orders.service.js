const path = require('path');
const fs = require('fs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'orders.json');

function readOrders() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(orders, null, 2));
}

const VALID_TRANSITIONS = {
  NEW: ['PREPARING'],
  PREPARING: ['READY'],
  READY: []
};

function getActiveOrders() {
  return readOrders();
}

module.exports = {
  getActiveOrders
};
