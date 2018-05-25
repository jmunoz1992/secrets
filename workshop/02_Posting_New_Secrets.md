# Posting New Secrets

*Previous:* **[01 Keeping Private Secrets Private](./01_Keeping_Private_Secrets_Private.md)**

Even though the client doesn't allow for users to create new secrets, they actually could by using Postman or curl to access the API directly. This is not what we want. So once again we need to write tests and change our code to prevent people from posting a new secret, unless they are logged in.

Here is the current code in our API which handles POST requests:

```javascript
router.post('/', (req, res, next) => {
  Secret.create(req.body)
    .then(newSecret => res.status(201).json(newSecret))
    .catch(next);
});
```

Look for the `it` method within the `POST /api/secrets` describe block like this:

```javascript
describe('POST /api/secrets', () => {
  it('should return a 401 unauthorized error');
});
```

For this test add the following steps within the callback function:

* Use the request(app) method to post to `/api/secrets/`
* Send an object with a key/value pair for the message of the secret you are creating
* Expect a 401 unauthorized status (because your a guest!)

Give it a try and then compare it to the solution below:

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
  it('should return a 401 unauthorized error', () => {
    return request(app)
      .post('/api/secrets/')
      .send({ message: 'This is a new secret' })
      .expect(401);
  });
```
</details><br />

Now that you have a new failing test. Let's alter the code to make it work!

To get this test working, all we really need to do is check that a user is logged in. So something like this could work:

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
router.post('/', (req, res, next) => {
  if (!req.user) {
    res.sendStatus(401);
  } else {
    Secret.create(req.body)
      .then(newSecret => res.status(201).json(newSecret))
      .catch(next);
  }
});
```
</details><br />

We still need a test for an authorized user. Find the it method like this in the 'with authenticated user' describe block:

```javascript
  describe('POST /api/secrets', () => {
    it('should create a new secret');
  });
```

Once again we will return the authenticatedUser agent rather than just using request(app). 

* Use it to post to '/api/secrets'
* Send an object with a message
* Expect a 201 response for created
* Then expect that the response body's message will be the same as what you sent
* Also check to make sure that the userId of the returned secret is 1, the same as the user

The final test should look like this:

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
it('should create a new secret', () => {
  return authenticatedUser
    .post('/api/secrets')
    .send({ message: 'a brand new secret' })
    .expect(201)
    .then(res => {
      expect(res.body.message).to.equal('a brand new secret');
      expect(res.body.userId).to.equal(1);
    });
});
```
</details><br />

To pass this test we somehow need to set the userId of the object we are using to create the new secret. Building off of solution for the last test we can add the user.id in right where it's needed.

This could work:

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
router.post('/', (req, res, next) => {
  if (!req.user) {
    res.sendStatus(401);
  } else {
    Secret.create({
      userId: req.user.id,
      ...req.body
    })
      .then(newSecret => res.status(201).json(newSecret))
      .catch(next);
  }
});
```
</details><br />

## The dangers of using req.body directly

You might have noticed that we pass the req.body object directly into our .create method. That could be a problem. The req.body is provided directly from our client. And someone using postman or curl could put whatever they want in that request body. While that may not matter in some cases, it could be disasterous in others. 

Keep in mind, that as your application grows, your models may gain new columns which you don't want users to be able to set directly.

Let's alter our existing POST test from above. First change the object you send to this:

```json
{
  message: 'a brand new secret',
  isPublic: true,
  userId: 3,
  id: 99
}
``` 

Two of these properties, message and isPublic, are ones that a user should be able to set. userId and id are properties that a user should not be able to set. So let's change our expectations accordingly:
* Add an expectation that the id NOT equal 99
* Add an expectation that isPublic is true
* Keep the two existing expectations as ther are now

When you are ready, look at the solution below:

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
describe('POST /api/secrets', () => {
  it('should create a new secret', () => {
    return authenticatedUser
      .post('/api/secrets')
      .send({
        message: 'a brand new secret',
        isPublic: true,
        userId: 3,
        id: 99
      })
      .expect(201)
      .then(res => {
        expect(res.body.message).to.equal('a brand new secret');
        expect(res.body.userId).to.equal(1);
        expect(res.body.id).to.not.equal(99);
        expect(res.body.isPublic).to.equal(true);
      });
  });
});
```

</details><br />

How can we make this test pass? Instead of just passing the req.body into the create method, we can build an object and only use particular values from the req.body object. See if you can change the post method to pass our new tests.

And then check out the solution below:

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
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
```
</details><br />

Now the post uses the properties from req.body that it should. Anything else that the user (or a hacker) might try to send is disregarded.

Cool! Now our post method is much more secure than it was. We have tests to make sure that only authenticated users can create secrets. And that the userId should match the user that created the message.

When you are ready, lets move on to updates and the push method.

*Next:* **[03 Updating Secrets](./03_Updating_Secrets.md)**