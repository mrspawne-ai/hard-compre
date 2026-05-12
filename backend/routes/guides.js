const router = require('express').Router();
const { GUIDES } = require('../data/seed');

router.get('/', (req, res) => res.json(GUIDES));
router.get('/:id', (req, res) => {
  const guide = GUIDES.find(g => g.id === req.params.id);
  if (!guide) return res.status(404).json({ error: 'Guide not found' });
  res.json(guide);
});

module.exports = router;
