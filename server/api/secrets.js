const router = require('express').Router();
const { Secret } = require('../db/models');
const { Op } = require('sequelize');

const isUser = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

const belongsTo = (req, res, next) => {
  const userId = req.user.id;
  Secret.findById(req.params.id)
    .then(secret => {
      if (secret.userId !== userId) {
        res.sendStatus(401);
      } else {
        req.user.secret = secret;
        next();
      }
    });
};

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
router.post('/', isUser, (req, res, next) => {
  Secret.create({
    message: req.body.message,
    userId: req.user.id,
    isPublic: req.body.isPublic,
  })
    .then(newSecret => res.status(201).json(newSecret))
    .catch(next);
});


router.put('/:id', isUser, belongsTo, (req, res, next) => {
  return req.user.secret.update({ isPublic: req.body.isPublic })
    .then(secret => res.status(200).json(secret))
    .catch(next);
});

router.delete('/:id', isUser, belongsTo, (req, res, next) => {
  Secret.destroy({ where: {id: req.params.id }})
  .then(() => res.sendStatus(200))
  .catch(next);
});

module.exports = router;
