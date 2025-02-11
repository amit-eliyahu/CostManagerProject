const express = require('express');
const router = express.Router();
const Cost = require('../models/cost'); // ייבוא המודל של ההוצאות

router.get('/', async (req, res) => {
    try {
        const { id, year, month } = req.query;

        // בדיקה שהפרמטרים קיימים
        if (!id || !year || !month) {
            return res.status(400).json({ error: "Missing required parameters: id, year, or month." });
        }

        // המרת חודש למספר דו-ספרתי
        const monthFormatted = String(month).padStart(2, '0');

        // חישוב טווח תאריכים לחודש
        const startDate = new Date(`${year}-${monthFormatted}-01T00:00:00.000Z`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        // שליפת כל ההוצאות של המשתמש עבור החודש והשנה הנתונים
        const costs = await Cost.find({
            userid: id,
            date: { $gte: startDate, $lt: endDate }
        });

        // קיבוץ ההוצאות לפי קטגוריה בפורמט הנכון
        const groupedCosts = [];

        // שמירת קטגוריות במבנה המתאים
        const categoryMap = {};
        costs.forEach(cost => {
            if (!categoryMap[cost.category]) {
                categoryMap[cost.category] = [];
            }
            categoryMap[cost.category].push({
                sum: cost.sum,
                description: cost.description,
                day: cost.date.getUTCDate() // שליפת היום מתוך התאריך
            });
        });

        // המרה למערך לפי הדרישה
        for (const category in categoryMap) {
            groupedCosts.push({ [category]: categoryMap[category] });
        }

        // מחזירים JSON מסודר בפורמט הנדרש
        res.status(200).json({
            userid: id,
            year: parseInt(year),
            month: parseInt(month),
            costs: groupedCosts
        });

    } catch (error) {
        console.error("Error getting monthly report:", error);
        res.status(500).json({ error: "An error occurred while getting the monthly report." });
    }
});

module.exports = router;
