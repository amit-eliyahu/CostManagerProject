const express = require('express');
const router = express.Router();
const Cost = require('../models/cost'); // מודל עלות


router.post('/', async (req, res) => {
    const { description, category, userid, sum } = req.body;
    const costDate = date ? new Date(date) : Date.now();
    const newCost = new Cost({
        description,
        category,
        userid,
        sum,
        date: costDate
    });

    try {
        await newCost.save();
        res.status(201).json(newCost);  // מחזיר את הפריט שהוסף
    } catch (error) {
        console.error("Error adding cost item:", error);
        res.status(500).json({ error: "An error occurred while adding the cost item." });// מחזיר שגיאה אם קרתה
    }
});

module.exports = router;