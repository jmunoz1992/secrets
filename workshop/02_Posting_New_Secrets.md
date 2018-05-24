# Posting New Secrets

*Previous:* **[01 Keeping Private Secrets Private](./01_Keeping_Private_Secrets_Private.md)**

Even though the client doesn't allow for users to create new secrets, they actually could by using Postman or curl and accessing the API directly. This is not what we want. So once again we need to write two tests and change our code to prevent people from posting a new secret, unless they are logged in.

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

* Use the request(app) method to post to `/api/secrets/:id`. For the :id use the `user1PrivateSecret.id`
* Send an object with a key/value pair for the message of the secret you are creating
* Expect a 401 unauthorized status (because your a guest!)

Give it a try and then compare it to this test:

```javascript
it('should return a 401 unauthorized error', () => {
  return request(app)
    .post('/api/secrets')
    .send({ message: 'a brand new secret' })
    .expect(401);
});
```

Now that you have a new failing test. Let's alter the code to make it work!

To get this test working, all we really need to do is check that a user is logged in. So something like this could work:

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
We still need a test for an authorized user. Find the it method like this in the 'with authenticated user' describe block:

```javascript
it('should create a new secret');
```

Once again we will return the authenticatedUser agent rather than just using request(app). 

* Use it to post to '/api/secrets'
* Send an object with a message
* Expect a 201 response for created
* Then expect that the response body's message will be the same as what you sent
* Also check to make sure that the userId of the returned secret is 1, the same as the user

The final test should look something like this:

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

To pass this test we somehow need to set the userId of the object we are using to create the new secret. Building off of solution for the last test we can add the user.id in right where it's needed.

Something like this could work:

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

## The dangers of using req.body directly

You might have noticed that we pass the req.body object directly into our .create method. That could be a problem. The req.body is provided directly from our client. And someone using postman or curl could put whatever they want in that request body. While that may not matter in some cases, it could be disasterous in others. 

Keep in mind, that as your application grows, your models may gain new columns which you don't want users to be able to set directly.

You may have also noticed that when you create a secret using the app, it always saves the secret as a private secret. You have to choose to make it public after it's created. We can test for both of these behaviors at the same time.

Let's alter our existing POST test from above. I want you to add two things. First in the send object, add a key value pair of, `isPublic: true`. Then in the tests add one more expectation, that the secret returned after it's created will be have isPublic set to false.

Now your test should look more like this:

```javascript
it('should create a new secret', () => {
  return authenticatedUser
    .post('/api/secrets')
    .send({ message: 'a brand new secret', isPublic: true })
    .expect(201)
    .then(res => {
      expect(res.body.message).to.equal('a brand new secret');
      expect(res.body.userId).to.equal(1);
      expect(res.body.isPublic).to.equal(false);
    });
});
```

How can we make this test pass? Well, we can take advantage of the fact that the model sets a default value of false for isPublic. And in our router post method, we can extract out specifically what we want from the req.body. See if you can change the post model to accomodate this.

And then check out the solution below:

```javascript
router.post('/', (req, res, next) => {
  if (!req.user) {
    res.sendStatus(401);
  } else {
    Secret.create({
      userId: req.user.id,
      message: req.body.message
    })
      .then(newSecret => res.status(201).json(newSecret))
      .catch(next);
  }
});
```
Now the post method only sets the message using req.body. Anything else that the user (or a hacker) might try to send is disregarded.

Cool! Now our post method is much more secure than it was. We have tests to make sure that only authenticated users can creat secrets. That users can only set the message initially for a new secret. And that the userId should match the user that created the message.

When you are ready, lets move on to updates and the push method.

*Next:* **[03 Updating Secrets](./03_Updating_Secrets.md)**