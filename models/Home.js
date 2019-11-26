const mongoose = require('mongoose');

// Create a Schema
const StockListSchema = new mongoose.Schema({
    symbol: { type: String},
    name: {type: String},
    price:{type: Number}
})

const realTimePriceSchema = new mongoose.Schema({
    symbol: { type: String},
    price: {type: Number},
})

const searchHistorySchema = new mongoose.Schema({
    search: { type: String},
    created: {type: String},
    user_id:{type: String},
    note:{type: String}
})
module.exports.StockList = mongoose.model('stock_list',StockListSchema,'stock_list');
module.exports.PriceList = mongoose.model('price_list',realTimePriceSchema,'price_list');
module.exports.search = mongoose.model('search',searchHistorySchema,'search');

