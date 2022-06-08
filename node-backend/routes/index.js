const express = require('express');
const rootRouter = express.Router();
const categoriesRoutes = require('./categories');
const productsRoutes = require('./products');
const usersRoutes = require('./users');
const ordersRoutes = require('./orders');

rootRouter.use(`/categories`, categoriesRoutes);
rootRouter.use(`/products`, productsRoutes);
rootRouter.use(`/users`, usersRoutes);
rootRouter.use(`/orders`, ordersRoutes);

module.exports = rootRouter;
