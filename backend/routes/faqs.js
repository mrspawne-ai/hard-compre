const router = require('express').Router();
const { FAQS } = require('../data/seed');

router.get('/', (req, res) => res.json(FAQS));

module.exports = router;
