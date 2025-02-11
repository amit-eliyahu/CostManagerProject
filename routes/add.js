const express = require('express');
const router = express.Router();
const Cost = require('../models/cost'); // Import cost model

/**
 * Date function to parse and validate the date.
 */
function parseDate(date) {
    if (date) {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate)) // Validate the date
        {
            return parsedDate;
        }
    }
    return Date.now(); // Default to current date if invalid
}

/**
 * Create and save a new cost item.
 */
async function createCostItem(data) {
    const newCost = new Cost(data);
    await newCost.save();
    return newCost;
}

/**
 * POST endpoint to add a new cost item.
 */
router.post('/', async (req, res) => {
    const { description, category, userid, sum, date } = req.body;

    const costDate = parseDate(date); // Use date function to parse the date

    try {
        const newCost = await createCostItem({ description, category, userid, sum, date: costDate }); // Create and save the new cost item

        res.status(201).json(newCost); // Respond with the created cost item
    } catch (error) {
        console.error("Error adding cost item:", error);
        res.status(500).json({ error: "An error occurred while adding the cost item." });
    }
});

module.exports = router;
