# Refactor

*Previous:* **[04 Deleting Secrets](./04_Deleting_Secrets.md)**

If you look back over the express router we have rewritten, you will notice that this code isn't quite dry. There are some places where we could refactor. 

One thing we can do is use middleware for pieces of code which are executed in more than one route. Middleware is a function inserted as a callback function into a route and executed before the rest of the code for the route. We are already using logging middleware to log out certain info to the console whenever our express router processes a request.

Let's add two pieces of middleware to this solution and refactor our routes.

## isUser middleware

We may have many routes that we want to restrict to authenticated users. In this router, three of the four routes work like that. Here is the general format of a middleware function:

```javascript
const myMiddleware = (req, res, next) => {
  //do something
  next()
}
```

See if you can write middleware called isUser that checks to see if a user is logged in. If they are not, the throw an error with a 401 status. If they are, it simply goes to the next function.

Here is a possible solution:

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
const isUser = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.sendStatus(401)
  }
}
```

Add this to the top of your secrets.js file and then add the middleware to your .post, .put and .delete routes. Be sure to remove the code within the routes that checks to see if a user is logged in. If you did it right, your tests will still pass!

See how tests allow you to refactor with confidence?

Your code should look something like this after you refactor:

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
router.post('/', isUser, (req, res, next) => {
  Secret.create({
    message: req.body.message,
    isPublic: req.body.isPublic,
    userId: req.user.id
  })
    .then(newSecret => res.status(201).json(newSecret))
    .catch(next);
});

router.put('/:id', isUser, (req, res, next) => {
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
});

router.delete('/:id', isUser, (req, res, next) => {
  Secret.findById(req.params.id)
    .then(secret => {
      if (secret.userId !== req.user.id) {
        res.sendStatus(401);
      } else {
        Secret.destroy({ where: {id: req.params.id }})
        .then(() => res.sendStatus(200));
      }
    })
    .catch(next);
});
```
</details><br />

## belongsTo

You might also notice that for two routes, we have a step where we find the secret and then check to make sure the user owns that before proceeding. Let's see if we can refactor this too. 

Try to make your own middleware or check out the solution below:

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
const belongsTo = (req, res, next) => {
  const userId = req.user.id;
  Secret.findById(req.params.id)
    .then(secret => {
      if (secret.userId !== userId) {
        res.sendStatus(401);
      } else {
        res.user.secret = secret
        next();
      }
    });
};
```
</details><br />

Then you can refactor your put and delete routes to be much simpler. Notice in my solution, in the middleware, I attached the secret to the req.user object so that it's available to use in the put method.

<details><summary><strong>Solution Hint:</strong></summary>

```javascriptrouter.put('/:id', isUser, belongsTo, (req, res, next) => {
  return req.user.secret.update({ isPublic: req.body.isPublic })
    .then(secret => res.status(200).json(secret))
    .catch(next);
});

router.delete('/:id', isUser, belongsTo, (req, res, next) => {
    Secret.destroy({ where: {id: req.params.id }})
      .then(() => res.sendStatus(200))
      .catch(next);
});
```
</details>


