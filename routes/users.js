const express = require('express');
const router = express.Router();
const User = require('../models/user'); // מודל משתמש

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    const costs = await Cost.aggregate([
      { $match: { userid: userId } },
      { $group: { _id: null, total: { $sum: "$sum" } } }
    ]);

    res.status(200).json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: userId,
      total: costs[0] ? costs[0].total : 0
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

