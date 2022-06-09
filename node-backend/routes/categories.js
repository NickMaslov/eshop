const express = require('express');
const router = express.Router();

const { Category } = require('../models');

router.get(`/`, async (req, res) => {
    try {
        const categoryList = await Category.find();

        if (!categoryList) {
            res.status(500).send({ success: false });
        }
        res.status(200).send(categoryList);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        console.log(' *** ', req.params.id, ' *** ');
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send({
                message: 'The category with the given ID was not found.',
            });
        }
        res.status(200).send(category);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/', async (req, res) => {
    try {
        let category = new Category({
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        });
        category = await category.save();

        if (!category)
            return res.status(400).send('the category cannot be created!');

        res.send(category);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                icon: req.body.icon || category.icon,
                color: req.body.color,
            },
            { new: true } //return updated category
        );

        if (!category)
            return res.status(400).send('the category cannot be created!');

        res.send(category);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndRemove(req.params.id);
        if (!category) {
            return res.status(404).send('category not found!');
        }

        res.status(200).send('the category is deleted!');
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
