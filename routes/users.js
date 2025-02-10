const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

// קבלת פרטי משתמש וסכום כל ההוצאות שלו
router.get('/:userid', async (req, res) => {
  const userId = req.params.userid;

  try {
    // חיפוש המשתמש במסד הנתונים
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // חיפוש כל ההוצאות של המשתמש
    const costs = await Cost.find({ userid: userId });

    // חישוב הסכום הכולל של ההוצאות ללא reduce
    let totalSum = 0;
    for (const cost of costs) {
      totalSum += cost.sum;
    }

    // החזרת נתוני המשתמש והסכום הכולל
    res.status(200).json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: userId,
      total: totalSum
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
