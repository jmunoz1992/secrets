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

router.put('/:id', (req, res, next) => {
  Secret.findById(req.params.id)
    .then(secret => secret.update(req.body))
    .then(secret => res.status(202).json(secret))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  const userId = req.user && req.user
  if (req.user) {
    const userId = req.user.id;
  } else {
    res.status(401).send('Unauthorized');
    return;
  }

  Secret.destroy({
    where: {
      id: req.params.id,
      userId: userId
    }
  })
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
