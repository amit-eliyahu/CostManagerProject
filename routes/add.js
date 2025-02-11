const express = require('express');
const router = express.Router();
const Cost = require('../models/cost'); // מודל עלות

router.post('/', async (req, res) => {
    const { description, category, userid, sum, date } = req.body;

    let costDate = Date.now();  // ברירת מחדל: תאריך הזמן הנוכחי.

    if (date) {
        const parsedDate = new Date(date);
        // בדיקה אם התאריך שהוזן הוא תאריך תקין
        if (!isNaN(parsedDate)) {
            costDate = parsedDate;
        }
    }

    const newCost = new Cost({
        description,
        category,
        userid,
        sum,
        date: costDate
    });

    try {
        // שמירת ההוצאה החדשה
        await newCost.save();

        // מחזירים את הפריט שהוסף
        res.status(201).json(newCost);
    } catch (error) {
        console.error("Error adding cost item:", error);
        res.status(500).json({ error: "An error occurred while adding the cost item." });
    }
});

module.exports = router;
