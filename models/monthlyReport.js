const mongoose = require('mongoose');

/**
 * Schema for storing precomputed monthly reports.
 */
const reportSchema = new mongoose.Schema({
    userid: { type: Number, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    costs: { type: Object, required: true }, // Store categorized costs
});

const Report = mongoose.model('Monthlyreport', reportSchema);
module.exports = Report;
