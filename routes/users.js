const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

router.get('/:userid', async (req, res) => {
  const userId = req.params.userid;  // מזהה המשתמש מה- URL

  try {
    // חיפוש המשתמש לפי ה-id (ולא userid)
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // החזרת הנתונים
    res.status(200).json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: userId,
      total: user.totalCost // מחזיר את ה-totalCost ששמור אצל המשתמש
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
