const router = require('express').Router();
const { Secret } = require('../db/models');

router.get('/', (req, res, next) => {
  Secret.findAll()
  .then(secrets => res.json(secrets))
  .catch(next);
});

module.exports = router;
