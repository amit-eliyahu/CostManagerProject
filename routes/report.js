const express = require('express');
const router = express.Router();
const Cost = require('../models/cost'); // Import the cost model
const MonthlyReport = require('../models/monthlyReport'); // Import the report model

/**
 * Validate the query parameters for id, year, and month.
 */
function validateQueryParams(query) {
    const { id, year, month } = query;
    return id && year && month;
}

/**
 * Format the month to be two digits (e.g., 09 for September).
 */
function formatMonth(month) {
    return String(month).padStart(2, '0');
}

/**
 * Calculate the start and end dates for the given year and month.
 */
function calculateDateRange(year, month) {
    const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Move to the next month
    return { startDate, endDate };
}

/**
 * Group the cost items by their categories.
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
 * Get or compute the monthly report for a user.
 */
router.get('/', async (req, res) => {
    try {
        // Validate the query parameters
        if (!validateQueryParams(req.query)) {
            return res.status(400).json({ error: "Missing required parameters: id, year, or month." });
        }

        const { id, year, month } = req.query;
        const monthFormatted = formatMonth(month); // Format month as two digits

        // Check if the report already exists in the database
        const existingReport = await MonthlyReport.findOne({ userid: id, year, month });
        if (existingReport) {
            console.log("Returning cached report from database.");
            return res.status(200).json(existingReport);
        }

        // If report doesn't exist, calculate it
        const { startDate, endDate } = calculateDateRange(year, monthFormatted);
        const costs = await Cost.find({
            userid: id,
            date: { $gte: startDate, $lt: endDate }
        });

        // Get available categories from Cost schema
        const categories = Object.values(Cost.schema.path('category').enumValues);
        const categoryMap = groupCostsByCategory(costs, categories);

        // Prepare the grouped costs in the desired format
        const groupedCosts = categories.map(category => ({
            [category]: categoryMap[category] || []
        }));

        // Save the computed report in the database
        const newReport = new MonthlyReport({
            userid: id,
            year: parseInt(year),
            month: parseInt(month),
            costs: groupedCosts
        });

        await newReport.save();
        console.log("Computed and saved new report.");

        res.status(200).json(newReport);
    } catch (error) {
        console.error("Error getting monthly report:", error);
        res.status(500).json({ error: "An error occurred while getting the monthly report." });
    }
});

module.exports = router;
