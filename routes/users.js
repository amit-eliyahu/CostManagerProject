const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

router.get('/:userid', async (req, res) => {
  const userId = req.params.userid;  // מזהה המשתמש מה- URL

  try {
    // חיפוש המשתמש לפי ה-id
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // חישוב totalCost על פי ההוצאות של המשתמש
    const costs = await Cost.find({ userid: userId });
    let totalCost = 0;
    costs.forEach(cost => {
      totalCost += cost.sum;
    });

    // החזרת הנתונים עם חישוב ה-totalCost
    res.status(200).json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: userId,
      total: totalCost // חישוב התוצאה בזמן קריאה
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
