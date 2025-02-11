const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    const teamMembers = [
        { first_name: 'Amit', last_name: 'Eliyahu' },
        { first_name: 'Sharon', last_name: 'Elbaz' }
    ];

    res.status(200).json(teamMembers);
});

module.exports = router;