# Updating Secrets

*Previous:* **[02 Posting New Secrets](./02_Posting_New_Secrets.md)**

For this section (and the one on delete), we are going to add a new wrinkle. Not only do we need a test to make sure that guest users cannot edit an existing secret, we also need to make sure that users can't edit someone else's secret. And we still need a test to make sure that a user can edit their own secret. So in total need three tests.

Find the first it method, the one inside the guest describe block:

```javascript
describe('PUT /api/secrets/:id', () => {
  it('should return a 401 unauthorized error');
});
```

Like before, add a second argument to the it method, an arrow function. Inside the function:
* Use the request(app) to make a put request to `/api/secrets/${user1PrivateSecret.id}`
* Send it an object with the value pair of 'isPublic: true'
* Expect a 401 Unauthorized response

Why are we trying to use isPublic: true? Because we we know that is the thing we will be updating in other tests and that the secret we are trying to alter has isPublic set to false.

Now your test should look something like this:

```javascript
describe('PUT /api/secrets/:id', () => {
  it('should return a 401 unauthorized error', () => {
    return request(app)
      .put(`/api/secrets/${user1PrivateSecret.id}`)
      .send({ isPublic: true })
      .expect(401);
  });
});
```

Currently our put method in the router looks like this:

```javascript
router.put('/:id', (req, res, next) => {
  Secret.findById(req.params.id)
    .then(secret => secret.update(req.body))
    .then(secret => res.status(202).json(secret))
    .catch(next);
});
```
Notice that there is no check to make sure someone is logged in. Let's add one! (Hint: this check could be like the one we used in the last section)

```javascript
router.put('/:id', (req, res, next) => {
  if (!req.user) {
    res.sendStatus(401)
  } else {
    Secret.findById(req.params.id)
      .then(secret => secret.update(req.body))
      .then(secret => res.status(202).json(secret))
      .catch(next);
  }
});
```
Voila! We should be passing again. Now lets write a test to make sure that users who are logged in can edit their own secret. Look for this test inside the authenticated user section of the test file:

```javascript
describe('when user owns secret', () => {
  describe('PUT /api/secrets/:id', () => {
    it('should update a secret');
  });
```

This test should:
* Use and return the authenticatedUser agent
* Make a put request to `/api/secrets/${user1PrivateSecret.id}`. Note that this is the secret that belongs to user 1. Also note that it needs to be inside back ticks \` not single or double quotation marks
* Send an object with the key/value pair like this `{ isPublic: true }`
* Expect a 200 response
* Then expect the response body to have a property of isPublic set to true

See if you can do it and then check the solution below:

```javascript
it('should update a secret', () => {
  return authenticatedUser
    .put(`/api/secrets/${user1PrivateSecret.id}`)
    .send({ isPublic: true })
    .expect(200)
    .then(res => {
      expect(res.body.isPublic).to.equal(true);
    });
});
```

While we are at it, let's write the other test for authenticated users, the one where a user is attempting to edit someone else's secret:

```javascript
describe('when user does NOT own secret', () => {
  describe('PUT /api/secrets/:id', () => {
    it('should return a 401 unauthorized error');
  });
```
Again this one should use the authenticatedUser agent:
* Make a put request to `/api/secrets/${user2PrivateSecret.id}`. Notice this is the id for the private secret that user 2 owns, not user 1
* Send the same object: `{ isPublic: true }`
* Expect a 401 response

Here is the test I wrote:

```javascript
it('should return a 401 unauthorized error', () => {
  return authenticatedUser
    .put(`/api/secrets/${user2PrivateSecret.id}`)
    .send({ isPublic: true })
    .expect(401);
});
```

Now we have 2 failing tests. Let's see if we can get them working both working. We will need to add a test to make sure that the userId of the secret matches the user making the request. 

Give it a try and then check out a solution below. For this one I decided to use async/await.

```javascript
router.put('/:id', async (req, res, next) => {
  if (!req.user) {
    res.sendStatus(401)
  } else {
    try {
      const secret = await Secret.findById(req.params.id)
      if (secret.userId === req.user.id) {
        secret.update(req.body)
      } else {
        res.sendStatus(401)
      }
    } catch(err) {
      next(err);
    } 
  }
});
```
Did you see that req.body problem again? We will once again need to write a test to make sure we didn't use req.body and allow users to update whatever they like. 

Find this test in your secrets.solution.spec.js file:

```javascript
it('should only update whether the secret isPublic');
```

Use the authenticatedUser:
* Make a put request to `/api/secrets/${user1PrivateSecret.id}`. Again this is the secret user 1 should be able to edit
* Send this with the request: `{ message: '99', isPublic: true }`. Note that a user should not be able to edit a secret once they have created it. They should only be able to change whether or not it's public or private
* Expect a 200 response
* Then expect that the response body's isPublic property is set to true
* But also expect that the response body's message is still equal to user1PrivateSecret.message, what it was originally

Here is an example of the test:

```javascript
it('should only update whether the secret isPublic', () => {
  return authenticatedUser
    .put(`/api/secrets/${user1PrivateSecret.id}`)
    .send({ message: '99', isPublic: true })
    .expect(200)
    .then(res => {
      expect(res.body.isPublic).to.equal(true);
      expect(res.body.message).to.equal(
        user1PrivateSecret.message
      );
    });
});
```

This test should fail, because the route as written does allow users to update secrets. You can change it like this to make it work:

```javascript
router.put('/:id', async (req, res, next) => {
  if (!req.user) {
    res.sendStatus(401)
  } else {
    try {
      const secret = await Secret.findById(req.params.id)
      if (secret.userId === req.user.id) {
        secret.update({ isPublic: req.body.isPublic })
      } else {
        res.sendStatus(401)
      }
    } catch(err) {
      next(err);
    } 
  }
});
```

Now isPublic is the only thing the user can update.

Onward to the delete methods!

*Next:* **[04 Deleting Secrets](./04_Deleting_Secrets.md)**