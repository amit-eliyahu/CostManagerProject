const mongoose = require('mongoose');

/**
 * Schema for Cost document in MongoDB.
 * Defines the structure and validation for the cost data.
 */

const costSchema = new mongoose.Schema({
    description: { type: String, required: true }, // Description of the cost item.
    category: { type: String, required: true, enum: ['food', 'health', 'housing', 'sport', 'education'] }, // Category of the cost item. Enums define acceptable values.
    userid: { type: Number, required: true }, // The user ID associated with the cost.
    sum: { type: Number, required: true }, // The amount of money spent.
    date: { type: Date, default: Date.now } // Date when the cost was recorded, defaults to current date.
});

/**
 * Cost model to interact with the 'Cost' collection in the database.
 */
const Cost = mongoose.model('Cost', costSchema);
module.exports = Cost; // Exporting the model for use in other parts of the app.
