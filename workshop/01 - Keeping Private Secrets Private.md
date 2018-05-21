# Keeping Private Secrets Private

Let's start with the route that gets the secrets in the first place. When we visit `/api/secrets` we currently get something like this:

```json
[
  {
    id: 1,
    message: "I love the admin of this web site.",
    isPublic: true,
    createdAt: "2018-05-19T18:22:32.743Z",
    updatedAt: "2018-05-19T18:22:32.743Z",
    userId: 1
  },
  {
    id: 2,
    message: "Once I shoplifted from Macys.",
    isPublic: false,
    createdAt: "2018-05-19T18:22:32.743Z",
    updatedAt: "2018-05-19T18:22:32.743Z",
    userId: 1
  },
  {
    id: 3,
    message: "I took the SAT for my sister. I got a terrible score.",
    isPublic: true,
    createdAt: "2018-05-19T18:22:32.743Z",
    updatedAt: "2018-05-19T18:22:32.743Z",
    userId: 2
  },
  {
    id: 4,
    message: "I don't trust anyone like I trust my dog.",
    isPublic: false,
    createdAt: "2018-05-19T18:22:32.743Z",
    updatedAt: "2018-05-19T18:22:32.743Z",
    userId: 2
  }
]
```

The biggest thing we need to do is to only return messages that are meant to be public. Before we write the code, we will need to write the test. Open up `/server/api/secrets.solution.spec.js` and take a look at the structure. Note that a lot of the prep work has been filled in for you. We have a beforeEach method at the beginning of the first describe block that achieves two things. First it seeds the database with data from a seed file. 

Second it finds the user with id 1. And two private secrets which we will need later. One that belongs to user 1 and one that does not.

Now let's write our first test. Find the first it block in the file:

```javascript
it('should return only the secrets which are public'); 
```
* Add an arrow function as the second argument for the 'it' method
* Use the request object to get `/api/secrets`
* Expect that the api responds with a 200 status
* Then take the `res`ponse and check the body to make sure it's an array
* And that the body has a length of 2, since there are only 2 public secrets in the seed file
* Finally expect that isPublic for the first secret is true

When you are done your test should look something like this:

```javascript
it('should return only the secrets which are public', () => {
  return request(app)
    .get('/api/secrets')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(2);
      expect(res.body[0].isPublic).to.equal(true);
    });
});
```
Let's run the test and make sure it fails. What I like to do is to run mocha with the -w flag, so that it automatically runs the tests again whenver someothing changes. Try it by running `npm run test-watch`.

Your test should be failing, and our first step completed. Now let's look at the existing code and see if we can change it to pass our specs.

```javascript
router.get('/', (req, res, next) => {
  Secret.findAll()
  .then(secrets => {
    res.json(secrets);
  })
  .catch(next);
});
```
As you can see, it just grabs all the secrets and sends them out in the response. Instead, let's filter them so that only the ones with isPublic set to true are sent out. 

This should work:

```javascript
router.get('/', (req, res, next) => {
  Secret.findAll()
    .then(secrets => {
      secrets = secrets.filter(secret => secret.isPublic === true);
      res.json(secrets);
    })
    .catch(next);
});
```

Now we need to build another test for when an authenticated user grabs all the secrets. In addition to all the public secrets, they should also grab their own private ones. First let's write the test. Find this test:

```javascript
it('should return public secrets and their private secrets');
```
It should be in the middle of the file, part of the 'with authenticated user' describe block. Before you begin, take a look at the beforeEach right before it. For these set of tests we will first login an authenticated user. To do this we need create an agent using the request.agent method. Then in the before each we use that agent to log in. Notice that we added a test witin the beforeEach block which tests to make sure that the login succeeded. Now we are ready to do the actual test.

Now within the it method:
* Add a get request to `/api/secrets`
* Expect a 200 response
* Then check to see if the response body is an array
* Finally check to see if the response body has a length of 3 (there are 2 public secrets and one private one that belongs to use 2)

The final test would look like this:

```javascript
it('should return public secrets and their private secrets', () => {
  return authenticatedUser
    .get('/api/secrets')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.equal(COUNT_PUBLIC + COUNT_USER1_PRIVATE);
    });
});
```

There are a few ways we could do this, but one way would be to alter our secrets filter to include items where the userId matches our user's id. 

See the solution below:

```javascript
router.get('/', (req, res, next) => {
  const userId = req.user && req.user.id ? req.user.id : null;
  Secret.findAll()
    .then(secrets => {
      secrets = secrets.filter(secret => {
        return secret.isPublic || secret.userId === userId;
      });
      res.json(secrets);
    })
    .catch(next);
});
```
Note that if you need to make sure req.user exists before checking for req.user.id or you may get an error when there isn't a user. Now our filter will include all public secrets and all secrets owned by the current user.

Check the tests, is everything passing again? If so, let's move on to the POST route.
