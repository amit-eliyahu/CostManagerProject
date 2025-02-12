const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

/**
 * Find a user by their id.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object|null>} - The user object or null if not found.
 */
async function findUserById(userId) {
  return await User.findOne({ id: userId });
}

/**
 * Calculate the total cost of a user based on their expenses.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<number>} - The total cost for the user.
 */
async function calculateTotalCost(userId) {
  const costs = await Cost.find({ userid: userId });
  return costs.reduce((total, cost) => total + cost.sum, 0);
}

/**
 * Handles errors in a consistent manner.
 * @param {Error} error - The error that occurred.
 * @param {Object} res - The response object.
 */
function handleError(error, res) {
  console.error('Error:', error);
  res.status(500).json({ error: error.message });
}

/**
 * Main handler for the user report endpoint.
 * @route GET /:userid
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/:userid', async (req, res) => {
  const userId = Number(req.params.userid); // Get the user ID from the URL
  try {
    const user = await findUserById(userId); // Find the user by ID
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalCost = await calculateTotalCost(userId); // Calculate the total cost for the user

    // Return the user details along with total cost
    res.status(200).json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: userId,
      total: totalCost
    });
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
