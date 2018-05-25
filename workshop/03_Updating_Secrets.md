# Updating Secrets

*Previous:* **[02 Posting New Secrets](./02_Posting_New_Secrets.md)**

For this section (and the one on delete), we are going to add a new wrinkle. Not only do we need a test to make sure that guest users cannot edit an existing secret, we also need to make sure that users can't edit someone else's secret. And we still need a test to make sure that a user can edit their own secret. So in total need three tests.

Find the it block inside the guest section that looks like this:

```javascript
  describe('PUT /api/secrets/:id', () => {
    it('should return a 401 unauthorized error');
  });
```

Like before, add an arrow function as the second argument of the it method. Inside the function add the following:

* Use the request(app) to make a put request to `/api/secrets/${user1PrivateSecret.id}`
* Send it an object with the value pair of 'isPublic: true'
* Expect a 401 Unauthorized response

We are using the id from user1PrivateSecret, a secret that we know belongs to the user with id 1 and is set to be private.

Now your test should look something like this:

<details><summary><strong>Solution Hint:</strong></summary>

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
</details><br />

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

<details><summary><strong>Solution Hint:</strong></summary>

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
</details><br />

Voila! We should be passing again. Now lets write a test to make sure that users who are logged in can edit their own secret. Look for this pending test inside the authenticated user section of the test file:

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

<details><summary><strong>Solution Hint:</strong></summary>

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
</details><br />

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

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
it('should return a 401 unauthorized error', () => {
  return authenticatedUser
    .put(`/api/secrets/${user2PrivateSecret.id}`)
    .send({ isPublic: true })
    .expect(401);
});
```
</details><br />

Now we have 2 failing tests. Let's see if we can get them working both working. We will need to check to make sure that the userId of the secret matches the user making the request. 

Give it a try and then check out a solution below.

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
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
        return secret.update(req.body);
      })
      .then(secret => res.status(200).json(secret))
      .catch(next);
  }
});
```
</details><br />

Did you see that req.body problem again? We will once again need to write a test to make sure we didn't use req.body and allow users to update whatever they like. 

Find this test in your specs:

```javascript
it('should only update whether the secret isPublic');
```

Now add the test and use the authenticatedUser:
* Make a put request to `/api/secrets/${user1PrivateSecret.id}`. Again this is the secret user 1 should be able to edit
* Send this with the request: `{ message: '99', isPublic: true }`. Note that a user should not be able to edit a secret once they have created it. They should only be able to change whether or not it's public or private
* Expect a 200 response
* Then expect that the response body's isPublic property is set to true
* But also expect that the response body's is NOT '99', since a user shouldn't be able to edit a secret's message

Here is an example of the test:

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
  it('should only update whether the secret isPublic', () => {
    return authenticatedUser
      .put(`/api/secrets/${user1PrivateSecret.id}`)
      .send({ message: '99', isPublic: true })
      .expect(200)
      .then(res => {
        expect(res.body.isPublic).to.equal(true);
        expect(res.body.message).to.not.equal('99');
      });
  });
```
</details><br />

This test should fail, because the route as written does allow users to update secrets. You can change it like this to make it work:

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
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
```
</details><br />

Now isPublic is the only thing the user can update.

Onward to the delete methods!

*Next:* **[04 Deleting Secrets](./04_Deleting_Secrets.md)**