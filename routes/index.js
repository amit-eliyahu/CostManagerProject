const express = require('express');
const router = express.Router();

/**
 * GET / - Home page.
 * @route GET /
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CostManager' });
});

module.exports = router;
