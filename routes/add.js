const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost'); // Import cost model

/**
 * Parses and validates a given date string.
 * @param {string} date - The date string to be parsed.
 * @returns {Date} - A valid Date object or the current date if invalid.
 */
function parseDate(date) {
    if (date) {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate)) {
            return parsedDate;
        }
    }
    return Date.now(); // Default to current date if invalid
}

/**
 * Create and save a new cost item.
 * @param {Object} data - The cost data to save.
 * @returns {Promise<Object>} - The newly created cost item.
 */
async function createCostItem(data) {
    const newCost = new Cost(data);
    await newCost.save();
    return newCost;
}


async function isUserIdExists(userId) {
    const user = await User.findOne({ id: userId });
    return user !== null; // Return true if user is found, otherwise false
}


/**
 * POST /costs
 * Adds a new cost item to the database.
 * @route POST /
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('/', async (req, res) => {
    const { description, category, userid, sum, date } = req.body;

    const userExists = await isUserIdExists(userid);
    if (!userExists) {
        return res.status(404).json({ error: "User not found" }); // Return error if user does not exist
    }

    const costDate = parseDate(date); // Use date function to parse the date

    try {
        const newCost = await createCostItem({ description, category, userid, sum, date: costDate });
        // Create and save the new cost item

        res.status(201).json(newCost); // Respond with the created cost item
    } catch (error) {
        console.error('Error adding cost item:', error);
        res.status(500).json({ error: 'An error occurred while adding the cost item.' });
    }
});

module.exports = router;
