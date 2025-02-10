const express = require('express');
const router = express.Router();
const Cost = require('../models/cost'); // מודל עלות
const User = require('../models/user'); // מודל משתמש

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

        // חישוב מחדש של totalCost עבור המשתמש
        const costs = await Cost.find({ userid: userid });
        let totalCost = 0;
        costs.forEach(cost => {
            totalCost += cost.sum;
        });

        // עדכון totalCost של המשתמש
        await User.findOneAndUpdate(
            { id: userid },  // חיפוש המשתמש לפי id
            { totalCost: totalCost }  // עדכון הסכום הכולל
        );

        // מחזיר את הפריט שהוסף
        res.status(201).json(newCost);
    } catch (error) {
        console.error("Error adding cost item:", error);
        res.status(500).json({ error: "An error occurred while adding the cost item." }); // מחזיר שגיאה אם קרתה
    }
});

module.exports = router;
