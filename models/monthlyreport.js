const mongoose = require('mongoose');

/**
 * Schema for storing precomputed monthly reports.
 * @param {Number} userid - The user ID associated with the report.
 * @param {Number} year - The year for the report.
 * @param {Number} month - The month for the report.
 * @param {Object} costs - Categorized costs for the report.
 */
const reportSchema = new mongoose.Schema({
    userid: { type: Number, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    costs: { type: Object, required: true }
});

/**
 * Mongoose model for interacting with the 'Monthlyreport' collection.
 * @param {Object} Report - The Report model to be exported.
 */
const Report = mongoose.model('Monthlyreport', reportSchema);
module.exports = Report;
