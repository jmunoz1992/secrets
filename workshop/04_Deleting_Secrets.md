# Deleting Secrets

*Previous:* **[03 Updating Secrets](./03_Updating_Secrets.md)**

We only have a few more tests to write! Are you excited? 

These tests will be a little simpler than the ones for update. We need three tests for three different cases:

1. When a guest tries to delete a secret, they get a 401 response
2. When a user tries to delete someone else's secret, they also get a 401 response
3. When a user tries to delete their own secret, they succeed and get a 200 response

The first test will  Find the it method inside the guest describe block that looks like this:

```javascript
describe('DELETE /api/secrets', () => {
  it('should return a 401 unauthorized error');
});
```
Within this test use the request(app) to:
* Make a delete request to `/api/secrets/${user1PrivateSecret.id}`
* Expect a 401 response

Try to write the test and then look at the solution below:

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
describe('DELETE /api/secrets', () => {
  it('should return a 401 unauthorized error', () => {
    return request(app)
      .delete(`/api/secrets/${user1PrivateSecret.id}`)
      .expect(401);
  });
});
```
</details><br />

Next find the other it method within the section for when the user DOES NOT own the secret. It will be all the way at the bottom.

Again follow the same steps. It will be nearly identical except for two important points:

* Use the authenticatedUser instead of request(app) 
* And use hit this route using the id for user 2's private secret: `/api/secrets/${user2PrivateSecret.id}`

When you are ready see the solution below:

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
describe('DELETE /api/secrets', () => {
  it('should return a 401 unauthorized error', () => {
    return authenticatedUser
      .delete(`/api/secrets/${user2PrivateSecret.id}`)
      .expect(401);
  });
});
```
</details><br />

We have one final test to write for when a user tries to delete their own secret. Look for this 'it' method:

```javascript
describe('DELETE /api/secrets', () => {
  it('should delete a secret');
});
```

Again this should be very similar to the other tests. See if you can figure out this one without the explicit steps spelled out. And when you are ready look at the solution below.

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
describe('DELETE /api/secrets', () => {
  it('should delete a secret', () => {
    return authenticatedUser
      .delete(`/api/secrets/${user1PrivateSecret.id}`)
      .expect(200);
  });
});
```
</details><br />

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

Now run your tests. Only one of them should be passing, the one where the user can delete their own. Here is the current route:

```javascript
router.delete('/:id', (req, res, next) => {
  Secret.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(secret => res.status(204)
    .catch(next);
});
```

Let's see if we can change the route so all three pass. 

See if you can figure it out on your own. And when you are ready, check the solution below.

<details><summary><strong>Solution Hint:</strong></summary>

``` javascript
router.delete('/:id', (req, res, next) => {
  if (!req.user) {
    res.sendStatus(401);
  } else {
    Secret.findById(req.params.id)
      .then(secret => {
        if (secret.userId !== req.user.id) {
          res.sendStatus(401);
        } else {
          return res.sendStatus(200);
        }
      })
      .catch(next);
  }
});
```
</details><br />

First, we check to make sure there is someone logged in. If a guest (or non-logged in user) hits this route, we send a 401 status in that case. 

Great! We now have all the tests passing and we know our API is more secure than when we started.

Your next mission, should you choose to accept it, is refactor!

*Next:* **[05 Refactor](./05_Refactor.md)**