const express = require('express');
const router = express.Router();

const { Order, OrderItem } = require('../models');

router.get(`/`, async (req, res, next) => {
    try {
        const orderList = await Order.find()
            .populate('user', 'name')
            .sort({ dateOrdered: -1 });

        if (!orderList) {
            res.status(404).send("Order doesn't exist.");
        }
        res.send(orderList);
    } catch (error) {
        next(error);
    }
});

router.get(`/:id`, async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: 'category',
                },
            });

        if (!order) {
            res.status(404).send("Order doesn't exist.");
        }
        res.send(order);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const orderItemsIds = Promise.all(
            req.body.orderItems.map(async (orderItem) => {
                let newOrderItem = new OrderItem({
                    quantity: orderItem.quantity,
                    product: orderItem.product,
                });

                newOrderItem = await newOrderItem.save();

                return newOrderItem._id;
            })
        );
        const orderItemsIdsResolved = await orderItemsIds;

        const totalPrices = await Promise.all(
            orderItemsIdsResolved.map(async (orderItemId) => {
                const orderItem = await OrderItem.findById(
                    orderItemId
                ).populate('product', 'price');
                const totalPrice = orderItem.product.price * orderItem.quantity;
                return totalPrice;
            })
        );

        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user,
        });
        order = await order.save();

        if (!order) return res.status(400).send('the order cannot be created!');

        res.send(order);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
    } catch (error) {
        next(error);
    }
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status,
        },
        { new: true }
    );

    if (!order) return res.status(400).send('The order cannot be updated!');

    return res.send(order);
});

router.delete('/:id', async (req, res, next) => {
    try {
        const order = await Order.findByIdAndRemove(req.params.id);

        if (!order) return res.status(404).send('Order not found!');

        await order.orderItems.map(async (orderItem) => {
            await OrderItem.findByIdAndRemove(orderItem);
        });

        return res.status(200).send('the order is deleted!');
    } catch (error) {
        next(error);
    }
});

router.get('/get/totalsales', async (req, res, next) => {
    try {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } },
        ]);

        if (!totalSales) {
            return res.status(400).send('The order sales cannot be generated');
        }

        res.send({ totalsales: totalSales.pop().totalsales });
    } catch (error) {
        next(error);
    }
});

router.get(`/get/count`, async (req, res, next) => {
    try {
        const orderCount = await Order.countDocuments({
            count: (count) => count,
        });

        if (!orderCount) {
            return res.status(500).send('Cannot coutn orders!');
        }
        return res.send({
            orderCount: orderCount,
        });
    } catch (error) {
        next(error);
    }
});

router.get(`/get/userorders/:userid`, async (req, res, next) => {
    try {
        const userOrderList = await Order.find({ user: req.params.userid })
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: 'category',
                },
            })
            .sort({ dateOrdered: -1 });

        if (!userOrderList) {
            return res.status(500).send("Can't find orders for the user!");
        }
        return res.send(userOrderList);
    } catch (error) {
        next(error);
    }
});
module.exports = router;
