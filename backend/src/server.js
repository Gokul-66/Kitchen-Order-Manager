const express = require('express');
const cors = require('cors');
const ordersRouter = require('./routes/orders.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/orders', ordersRouter);

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
