const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({});

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Order', orderSchema);
