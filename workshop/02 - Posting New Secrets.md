# Posting New Secrets

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
it('should return a 401 unauthorized error');
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

## The dangers of using req.body directly

You might have noticed that we pass the req.body object directly into our .create method. That could be a problem. The req.body is provided directly from our client. And someone using postman or curl could put whatever they want in that request body. While that may not matter in some cases, it could be disasterous in others. In this case, it could mean that someone might be able to create a new secret and provide whatever userId they like. 

  