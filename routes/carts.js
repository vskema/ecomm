const express = require('express');

const router = express.Router();

router.post('/cart/products', (req, res) => {
    console.log(req.body.productId);
    res.send('product added to cart')
})

module.exports = router;