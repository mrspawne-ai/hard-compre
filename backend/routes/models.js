const router = require('express').Router();
const { ALL_MODELS } = require('../data/seed');

router.get('/', (req, res) => {
  const { category } = req.query;
  const models = category ? ALL_MODELS.filter(m => m.category === category) : ALL_MODELS;
  res.json(models);
});

router.get('/:id', (req, res) => {
  const model = ALL_MODELS.find(m => m.id === req.params.id);
  if (!model) return res.status(404).json({ error: 'Model not found' });
  res.json(model);
});

module.exports = router;
