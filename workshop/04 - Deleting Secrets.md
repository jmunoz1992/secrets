# Deleting Secrets

If you take look at our existing tests. You will notice that there is a test for the route `DELETE /api/secrets/:id`:

```javascript
  describe('DELETE /api/secrets/:id', () => {
    it('should delete a secret', () => {
      return request(app)
        .delete('/api/secrets/1')
        .expect(204);
    });
  });
``` 
This test looks pretty straightforward. Make a delete request to '/api/secrets/1' and expect a 204 response. Notice any problem with this spec?

One glaring problem is that the test doesn't account for user permissions. Apparently, anyone can send a delete request and it will be honored. This is how the api works. We proved that with our curl command in the previous section.

Here is the route from the express router:

```javascript
router.delete('/:id', (req, res, next) => {
  Secret.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(secret => res.status(204).json(secret))
    .catch(next);
});
```
In this implementation, there is no check to make sure the current user has permission to destroy this secret. This is what we will fix. If a user is logged in, we can access that user's info within the express router via `req.user`, and get the user's id via `req.user.id`. We can then make sure that the user.id matches the userId property for the Secret we are destroying. There are multiple ways to accomplish this. Give it a try before looking at the solution below.

.
.
.
.
.
.
.
.
.

``` javascript
router.delete('/:id', (req, res, next) => {
  const userId = req.user && req.user.id ? req.user.id : null;
  if (!userId) {
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
```
First we get the userId from req.user. Note that we first make sure there is a req.user. If a guest (or non-logged in user) hits this route it will cause an error. We would rather send a 401 status in that case. 