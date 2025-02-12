const mongoose = require('mongoose');

/**
 * Mongoose schema for the Cost document.
 * @param {String} description - Description of the cost item.
 * @param {String} category - Category of the cost item.
 * @param {Number} userid - The user ID associated with the cost.
 * @param {Number} sum - The amount of money spent.
 * @param {Date} date - Date when the cost was recorded.
 */
const costSchema = new mongoose.Schema({
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ['food', 'health', 'housing', 'sport', 'education'] },
    userid: { type: Number, required: true },
    sum: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

/**
 * Cost model to interact with the 'Cost' collection in the database.
 * @param {Object} Cost - The Cost model to be exported.
 */
const Cost = mongoose.model('Cost', costSchema);
module.exports = Cost;
