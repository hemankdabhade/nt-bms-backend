const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Enable CORS for all domains
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// POST route to create a payment with Revolut
app.post('/api/revolut/create-order', async (req, res) => {
  try {
    const { orderId, amount, customerEmail } = req.body;

    const response = await axios.post(
      'https://merchant.revolut.com/api/1.0/orders',
      {
        amount: Math.round(amount * 100),
        currency: "EUR",
        capture_mode: "AUTOMATIC",
        merchant_order_ext_ref: `${orderId}`,
        description: `Order #${orderId}`,
        customer_email: customerEmail,
        return_url: "https://nt-bms.com/payment-success",
        cancel_url: "https:/nt-bms.com/payment-cancel",
      },
      {
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json', 
          'Authorization': 'Bearer sk_dwCsVOn-WgUpZqfWQ1MMemgb5-xYBxS_2VE0_PIfPLskwUPt2i9GE5CQI4SBdl3m'
        },
      }
    );

    // Extract and send only the checkout URL
    const checkoutUrl = response.data.checkout_url;
    res.json({ checkoutUrl });
  } catch (error) {
    console.error('Error processing payment:', error.response?.data || error.message);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Set the port for the backend server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
