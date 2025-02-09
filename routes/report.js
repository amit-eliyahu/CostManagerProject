const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cost = require('../models/cost'); // ייבוא המודל של ההוצאות

router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;

        // בדיקה שהפרמטרים קיימים
        if (!id || !year || !month) {
            return res.status(400).json({ error: "Missing required parameters: id, year, or month." });
        }

        // המרת `id` ל- ObjectId אם צריך
        const userId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;

        // המרת חודש למספר דו-ספרתי
        const monthFormatted = String(month).padStart(2, '0');

        // חישוב טווח תאריכים לחודש
        const startDate = new Date(`${year}-${monthFormatted}-01T00:00:00.000Z`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        // שליפת כל ההוצאות של המשתמש עבור החודש והשנה הנתונים
        const costs = await Cost.find({
            userid: userId,
            date: { $gte: startDate, $lt: endDate }
        });

        // קיבוץ ההוצאות לפי קטגוריה
        const groupedCosts = costs.reduce((acc, cost) => {
            const category = cost.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push({
                sum: cost.sum,
                description: cost.description,
                day: cost.date.getUTCDate() // שליפת היום מתוך התאריך
            });
            return acc;
        }, {});

        // מחזירים JSON מסודר
        res.status(200).json({
            userid: id,
            year: year,
            month: month,
            costs: groupedCosts
        });

    } catch (error) {
        console.error("Error getting monthly report:", error);
        res.status(500).json({ error: "An error occurred while getting the monthly report." });
    }
});

module.exports = router;
