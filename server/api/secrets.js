const router = require('express').Router();
const { Secret } = require('../db/models');
const { Op } = require('sequelize');

// first get all public secrets
// if a user is logged in, fetch all public and their own secrets
router.get('/', (req, res, next) => {
  let where = { isPublic: true };
  if (req.user) {
    where = { [Op.or]: [{userId: req.user.id}, { isPublic: true }] };
  }
  const userId = req.user && req.user.id ? req.user.id : null;
  Secret.findAll({ where })
    .then(secrets => {
      const filteredSecrets = secrets.map(secret => {
        return {
          id: secret.id,
          message: secret.message,
          isPublic: secret.isPublic,
          userId: secret.userId === userId ? userId : null
        };
      });
      return res.status(200).json(filteredSecrets);
    })
    .catch(next);
});

// if there is no authenticated user, automatically returns 401
// if there is an authenticated user, makes sure to only log req body fields that are valid
router.post('/', (req, res, next) => {
  if (!req.user) res.sendStatus(401);
  Secret.create({
    message: req.body.message,
    userId: req.user.id,
    isPublic: req.body.isPublic,
  })
    .then(newSecret => res.status(201).json(newSecret))
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  Secret.findById(req.params.id)
    .then(secret => secret.update(req.body))
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
