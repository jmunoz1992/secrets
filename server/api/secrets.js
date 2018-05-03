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

// Can only update isPublic
router.put('/:id', (req, res, next) => {
  Secret.findById(req.params.id)
    .then(secret => secret.update(req.body))
    .then(secret => res.status(202).json(secret))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  Secret.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(secret => res.status(204).json(secret))
    .catch(next);
});

module.exports = router;
