const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost'); // Import the cost model
const MonthlyReport = require('../models/monthlyreport'); // Import the report model

/**
 * Validate the query parameters for id, year, and month.
 * @param {Object} query - The query parameters from the request.
 * @returns {boolean} - True if parameters are valid, otherwise false.
 */

async function isUserIdExists(inputid){
    const user = await User.findOne({ id:Number(inputid)})
    return user !== null; // Return true if user is found, otherwise false
}


function validateQueryParams(query) {
    const { id, year, month } = query;
    return id && year && month && (isUserIdExists(id)!==null);
}

/**
 * Format the month to be two digits (e.g., 09 for September).
 * @param {string} month - The month to format.
 * @returns {string} - The formatted month as two digits.
 */
function formatMonth(month) {
    return String(month).padStart(2, '0');
}

/**
 * Calculate the start and end dates for the given year and month.
 * @param {number} year - The year to calculate the range for.
 * @param {string} month - The month to calculate the range for.
 * @returns {Object} - An object containing the start and end dates.
 */
function calculateDateRange(year, month) {
    const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Move to the next month
    return { startDate, endDate };
}

/**
 * Group the cost items by their categories.
 * @param {Array} costs - The list of cost items.
 * @param {Array} categories - The available categories.
 * @returns {Object} - A map of categories to their corresponding cost items.
 */
function groupCostsByCategory(costs, categories) {
    const categoryMap = {};
    categories.forEach(category => {
        categoryMap[category] = [];
    });

    costs.forEach(cost => {
        categoryMap[cost.category].push({
            sum: cost.sum,
            description: cost.description,
            day: cost.date.getUTCDate()
        });
    });

    return categoryMap;
}

/**
 * Fetch the existing report or calculate a new one if not found.
 * @param {string} id - The user ID.
 * @param {string} year - The year for the report.
 * @param {string} month - The month for the report.
 * @returns {Promise<Object>} - The monthly report.
 */
async function getOrCreateReport(id, year, month) {
    const currentDate = new Date();
    const currentYear = currentDate.getUTCFullYear();
    const currentMonth = parseInt(currentDate.getUTCMonth() + 1);

    if (parseInt(year) >= currentYear && parseInt(month) >= currentMonth) {
        console.log('Current month requested, computing new report.');
    } else {
        const existingReport = await MonthlyReport.findOne({ userid: id, year, month });
        if (existingReport) {
            console.log('Returning cached report from database.');
            return existingReport;
        }
    }

    const { startDate, endDate } = calculateDateRange(year, month);
    const costs = await Cost.find({
        userid: id,
        date: { $gte: startDate, $lt: endDate }
    });

    const categories = Object.values(Cost.schema.path('category').enumValues);
    const categoryMap = groupCostsByCategory(costs, categories);

    const groupedCosts = categories.map(category => ({
        [category]: categoryMap[category] || []
    }));

    const newReport = new MonthlyReport({
        userid: id,
        year: parseInt(year),
        month: parseInt(month),
        costs: groupedCosts
    });

    await newReport.save();
    console.log('Computed and saved new report.');
    return newReport;
}

/**
 * Get or compute the monthly report for a user.
 * @route GET /
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/', async (req, res) => {
    try {
        if (!validateQueryParams(req.query)) {
            return res.status(400).json({ error: 'Missing or incorrect required parameters: id, year, or month.' });
        }

        const { id, year, month } = req.query;
        const monthFormatted = formatMonth(month);

        const report = await getOrCreateReport(id, year, monthFormatted);
        res.status(200).json(report);
    } catch (error) {
        console.error('Error getting monthly report:', error);
        res.status(500).json({ error: 'An error occurred while getting the monthly report.' });
    }
});

module.exports = router;
