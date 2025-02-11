const express = require('express');
const router = express.Router();
const Cost = require('../models/cost'); // Import the cost model

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
 * Get the costs for the given user within the calculated date range.
 */
async function getCostsByDateRange(id, startDate, endDate) {
    return await Cost.find({
        userid: id,
        date: { $gte: startDate, $lt: endDate }
    });
}

/**
 * GET endpoint to get the monthly report for a user.
 */
router.get('/', async (req, res) => {
    try {
        // Validate the query parameters
        if (!validateQueryParams(req.query)) {
            return res.status(400).json({ error: "Missing required parameters: id, year, or month." });
        }

        const { id, year, month } = req.query;
        const monthFormatted = formatMonth(month); // Format month as two digits

        const { startDate, endDate } = calculateDateRange(year, monthFormatted); // Calculate the start and end date for the month

        const costs = await getCostsByDateRange(id, startDate, endDate); // Get the costs for the given user and date range

        const categories = Object.values(Cost.schema.path('category').enumValues); // Get the category values from the cost model

        const categoryMap = groupCostsByCategory(costs, categories); // Group costs by category

        // Prepare the grouped costs in the desired format
        const groupedCosts = categories.map(category => ({
            [category]: categoryMap[category] || [] // Return an empty array if no costs found
        }));

        // Send the response with the grouped costs
        res.status(200).json({
            userid: id,
            year: parseInt(year),
            month: parseInt(month),
            costs: groupedCosts
        });

    } catch (error) {
        console.error("Error getting monthly report:", error);
        res.status(500).json({ error: "An error occurred while getting the monthly report." });
    }
});

module.exports = router;
