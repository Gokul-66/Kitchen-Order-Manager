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

function updateOrderStatus(id, newStatus) {
  if (!newStatus || typeof newStatus !== 'string') {
    const err = new Error('Invalid status');
    err.code = 'INVALID_TRANSITION';
    throw err;
  }

  const orders = readOrders();
  const idx = orders.findIndex((o) => String(o.id) === String(id));

  if (idx === -1) {
    const err = new Error('Order not found');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const current = orders[idx];
  const allowed = VALID_TRANSITIONS[current.status] || [];

  if (!allowed.includes(newStatus)) {
    const err = new Error(`Invalid transition from ${current.status} to ${newStatus}`);
    err.code = 'INVALID_TRANSITION';
    throw err;
  }

  const updated = { ...current, status: newStatus, updatedAt: new Date().toISOString() };
  orders[idx] = updated;
  writeOrders(orders);
  return updated;
}

module.exports = {
  getActiveOrders,
  updateOrderStatus
};
