const router = require('express').Router();
const { Secret } = require('../db/models');
const { Op } = require('sequelize');

router.get('/', (req, res, next) => {
  let where = { isPublic: true };
  if (req.user) {
    where = { [Op.or]: [{userId: req.user.id}, { isPublic: true }] };
  }

  const userId = req.user && req.user.id ? req.user.id : null;
  Secret.findAll({ where })
    .then(result => {
      const secrets = result.map(secret => {
        return {
          id: secret.id,
          message: secret.message,
          isPublic: secret.isPublic,
          userId: secret.userId === userId ? userId : null
        };
      });
      res.status(200).json(secrets);
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  if (!req.user) {
    res.sendStatus(401);
  } else {
    Secret.create({
      message: req.body.message,
      isPublic: req.body.isPublic,
      userId: req.user.id
    })
      .then(newSecret => res.status(201).json(newSecret))
      .catch(next);
  }
});

router.put('/:id', (req, res, next) => {
  if (!req.user) {
    res.sendStatus(401);
  } else {
    Secret.findById(req.params.id)
      .then(secret => {
        if (secret.userId !== req.user.id) {
          res.sendStatus(401);
          return;
        }
        return secret.update({ isPublic: req.body.isPublic });
      })
      .then(secret => res.status(200).json(secret))
      .catch(next);
  }
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
