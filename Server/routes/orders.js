const { Order } = require('../models/orders');
const { Sale } = require('../models/sales');
const express = require('express');
const stripe = require('stripe')(process.env.SECRET_KEY);
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');

const siteUrl = process.env.SITE_URL;
const successUrlPath = process.env.SUCCESS_URL_PATH;
const cancelUrlPath = process.env.CANCEL_URL_PATH;

const success_url = `${siteUrl}${successUrlPath}`;
const cancel_url = `${siteUrl}${cancelUrlPath}`;

// Get count of orders
router.get('/count', async (req, res) => {
    try {
        const count = await Order.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order count' });
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orderList = await Order.find().populate('orderItems.product').populate('user');
        if (!orderList) {
            return res.status(500).json({ success: false });
        }
        res.send(orderList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('orderItems.product').populate('user');
        if (!order) {
            return res.status(404).json({ message: 'The order with the given ID was not found.' });
        }
        res.status(200).send(order);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


const generateOrderNumber = async () => {
    let orderNumber;
    let isUnique = false;

    while (!isUnique) {
        // Generate a random number with leading 'HT-' and 5 digits
        orderNumber = `DS-${Math.floor(10000 + Math.random() * 90000)}`;

        // Check if this order number already exists in the database
        const existingOrder = await Order.findOne({ orderNumber });

        if (!existingOrder) {
            isUnique = true;
        }
    }

    return orderNumber;
};

// Create a new order

router.post('/create', async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            user,
            paymentMethodDetails,
        } = req.body;

        // Await the result of generateOrderNumber
        const orderNumber = await generateOrderNumber();

        const order = new Order({
            orderItems,
            shippingAddress,
            paymentMethod,
            orderNumber, // Use the resolved orderNumber string
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            user
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Delete an order by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found!', status: false });
        }
        res.status(200).json({ message: 'The order is deleted!', status: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update an order by ID
router.put('/:id', async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, paymentResult, itemsPrice, taxPrice, shippingPrice, totalPrice, user, isPaid, paidAt, isDelivered, deliveredAt, status, fullName, email } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                orderItems,
                shippingAddress,
                paymentMethod,
                paymentResult,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                user,
                isPaid,
                paidAt,
                isDelivered,
                deliveredAt,
                status,
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(500).json({ message: 'Order cannot be updated!', success: false });
        }

        // If the status is set to 'Completed', create a sales entry
        if (status === 'Completed') {
            const totalAmount = updatedOrder.totalPrice; // Or calculate based on the products if needed
            const sale = new Sale({
                orderId: updatedOrder._id,
                products: updatedOrder.orderItems,
                totalAmount,
                user: updatedOrder.user,
            });

            const savedSale = await sale.save();
            if (!savedSale) {
                return res.status(500).json({ error: 'Failed to create sale record', success: false });
            }
        }

        res.send(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});


// checkout opi
// router.post("/create-checkout-session", async(req, res)=>{
//     const {products} = req.body;

//     const lineItems = products.map((product)=>({
//     price_data:{
//     currency: "trl",
//     product_data:{
//     name:product.name
//     },
//     unit_amount:product.price * 100,
//     },
//     quantity:product.quantity
// }));

//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items:lineItems,
//         mode: "payment",
//         success_url: "http://localhost:5173/thanksPage",
//         cancel_url: "http://localhost:5173/login"
//         });
//         res.json({id:session.id})
//     });


// router.post('/create-checkout-session', async (req, res) => {
//     try {
//       const { products } = req.body;
  
//       const lineItems = products.map(product => ({
//         price_data: {
//           currency: 'try',
//           product_data: {
//             name: product.name,
//             size: product.size,
//           },
//           unit_amount: product.price * 100,
//         },
//         quantity: product.quantity,
//       }));
  
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: lineItems,
//         mode: 'payment',
//         success_url: 'http://localhost:5173/thanksPage',
//         cancel_url: 'http://localhost:5173/cancel',
//       });
  
//       res.json({ id: session.id });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });

// orderController.js



router.post('/create-checkout-session', async (req, res) => {
    const { products } = req.body;

  const line_items = products.map(product => ({
    price_data: {
      currency: 'try',
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100,
    },
    quantity: product.quantity,
  }));


  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: success_url,
    cancel_url: cancel_url,
  });

  res.json({ id: session.id });
});



// const PAYTR_MERCHANT_ID = 'your_merchant_id';
// const PAYTR_MERCHANT_KEY = 'your_merchant_key';
// const PAYTR_MERCHANT_SALT = 'your_merchant_salt';

// router.post('/create-checkout-session', async (req, res) => {
//     const { products } = req.body;

//     const user_ip = req.ip;
//     const user_email = req.body.email; // Pass user email from frontend
//     const user_name = req.body.name;   // Pass user name from frontend
//     const user_address = req.body.address; // Pass user address from frontend
//     const user_phone = req.body.phone;     // Pass user phone from frontend
//     const merchant_oid = 'order_id_' + new Date().getTime(); // Unique Order ID
//     const payment_amount = products.reduce((acc, product) => acc + product.price * product.quantity, 0) * 100; // in kuruş
//     const merchant_ok_url = 'https://yourwebsite.com/success'; // Set your success URL
//     const merchant_fail_url = 'https://yourwebsite.com/fail'; // Set your fail URL
//     const installment_count = '0'; // No installment
//     const currency = 'TRY'; // Turkish Lira
//     const timeout_limit = '30';
//     const test_mode = 1; // Use 1 for test mode, 0 for live mode

//     const user_basket = JSON.stringify(products.map(product => [
//         product.name,
//         product.price * 100,
//         product.quantity
//     ]));

//     const hash_str = [
//         PAYTR_MERCHANT_ID,
//         user_ip,
//         merchant_oid,
//         user_email,
//         payment_amount,
//         merchant_ok_url,
//         merchant_fail_url,
//         installment_count,
//         currency,
//         test_mode,
//         user_basket
//     ].join('');

//     const paytr_token = crypto
//         .createHash('sha256')
//         .update(hash_str + PAYTR_MERCHANT_SALT)
//         .digest('hex');

//     const formData = {
//         merchant_id: PAYTR_MERCHANT_ID,
//         user_ip,
//         merchant_oid,
//         email: user_email,
//         payment_amount,
//         paytr_token,
//         user_basket,
//         merchant_ok_url,
//         merchant_fail_url,
//         installment_count,
//         user_name,
//         user_address,
//         user_phone,
//         timeout_limit,
//         currency,
//         test_mode,
//     };

//     try {
//         const response = await axios.post('https://www.paytr.com/odeme/api/get-token', formData);
//         res.json({ token: response.data.token });
//     } catch (error) {
//         console.error('Error generating PayTR token:', error.response.data);
//         res.status(500).json({ error: 'Payment token generation failed' });
//     }
// });



module.exports = router;
