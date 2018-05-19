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
  Secret.update(
    req.body,
    {
      where: { id: req.params.id },
      returning: true,
      plain: true
    }
  )
    .then(result => result[1].dataValues)
    .then(secret => res.status(200).json(secret))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  Secret.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
