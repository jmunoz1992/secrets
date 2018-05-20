const router = require('express').Router();
const { Secret } = require('../db/models');

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    res.sendStatus(401);
  } else {
    next();
  }
};

const belongsTo = (req, res, next) => {
  const userId = req.user.id;
  Secret.findById(req.params.id)
    .then(secret => {
      if (secret.userId !== userId) {
        res.sendStatus(401);
      } else {
        next();
      }
    });
};

router.get('/', (req, res, next) => {
  const userId = req.user && req.user.id ? req.user.id : null;
  Secret.findAll()
  .then(secrets => {
    secrets = secrets.filter(secret => {
      return secret.isPublic || secret.userId === userId;
    });
    secrets = secrets.map(secret => ({
      id: secret.id,
      message: secret.message,
      userId: secret.userId === userId ? userId : null,
      isPublic: secret.isPublic
    }));
    res.json(secrets);
  })
  .catch(next);
});

router.post('/', isLoggedIn, (req, res, next) => {
  Secret.create(req.body)
    .then(newSecret => res.status(201).json(newSecret))
    .catch(next);
});

router.put('/:id', isLoggedIn, belongsTo, (req, res, next) => {
  const secret = { isPublic: req.body.isPublic };
  Secret.update(
    secret,
    {
      where: {
        id: req.params.id
      },
      returning: true,
      plain: true
    }
  )
    .then(result => result[1].dataValues)
    .then(updatedSecret => res.status(200).json(updatedSecret))
    .catch(next);
});

router.delete('/:id', isLoggedIn, belongsTo, (req, res, next) => {
  Secret.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
