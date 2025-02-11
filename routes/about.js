const express = require('express');
const router = express.Router();

/**
 * GET /team
 * Returns a list of team members.
 * @route GET /
 */
router.get('/', function (req, res) {
    const teamMembers = [
        { first_name: 'Amit', last_name: 'Eliyahu' }, //student 1 full name
        { first_name: 'Sharon', last_name: 'Elbaz' } // student 2 full name
    ];

    res.status(200).json(teamMembers);
});

module.exports = router;