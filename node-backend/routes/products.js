const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Category, Product } = require('../models');

router.get(`/`, async (req, res) => {
    try {
        // localhost:3000/api/products?categories=cat1,cat2
        let filter = {};
        if (req.query.categories) {
            filter = { category: req.query.categories.split(',') };
        }

        const productList = await Product.find(filter).populate('category');

        if (!productList) {
            res.status(500).send({ success: false });
        }
        res.send(productList);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get(`/:id`, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            'category'
        );

        if (!product) {
            res.status(500).json({ success: false });
        }
        res.send(product);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post(`/`, async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).send('Invalid Category');

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        });

        product = await product.save();

        if (!product)
            return res.status(500).send('The product cannot be created');

        res.send(product);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        //I'm doing try-catch to handle this validation
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).send('Invalid Category');

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
            },
            { new: true }
        );

        if (!product)
            return res.status(500).send('the product cannot be updated!');

        res.send(product);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndRemove(req.params.id);

        if (product) {
            return res.status(200).send({
                success: true,
                message: 'the product is deleted!',
            });
        } else {
            return res.status(404).send({
                success: false,
                message: 'product not found!',
            });
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get(`/get/count`, async (req, res) => {
    try {
        const productCount = await Product.countDocuments();

        if (!productCount) {
            return res.status(500).json({ success: false });
        }
        res.send({
            productCount: productCount,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get(`/get/featured/:count?`, async (req, res) => {
    try {
        const count = req.params.count ? req.params.count : 0;
        const products = await Product.find({ isFeatured: true }).limit(+count);

        if (!products) {
            return res.status(500).json({ success: false });
        }
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
