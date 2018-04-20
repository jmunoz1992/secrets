const router = require('express').Router();
const { Secret } = require('../db/models');

router.get('/', (req, res, next) => {
  Secret.findAll()
  .then(secrets => res.json(secrets))
  .catch(next);
});

router.post('/', (req, res, next) => {
  Secret.create(req.body)
    .then(newSecret => res.status(201).json(newSecret))
    .catch(next);
});

module.exports = router;
