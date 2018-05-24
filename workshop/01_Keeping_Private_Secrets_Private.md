# Keeping Private Secrets Private

*Previous:* **[00 Before You Begin](./00_Before_You_Begin.md)**

Let's start with the route that gets the secrets in the first place. When we visit `/api/secrets` we currently get something like this:

```json
[
  {
    "id": 1,
    "message": "I love the admin of this web site.",
    "isPublic": true,
    "createdAt": "2018-05-19T18:22:32.743Z",
    "updatedAt": "2018-05-19T18:22:32.743Z",
    "userId": 1
  },
  {
    "id": 2,
    "message": "Once I shoplifted from Macys.",
    "isPublic": false,
    "createdAt": "2018-05-19T18:22:32.743Z",
    "updatedAt": "2018-05-19T18:22:32.743Z",
    "userId": 1
  },
  {
    "id": 3,
    "message": "I took the SAT for my sister. I got a terrible score.",
    "isPublic": true,
    "createdAt": "2018-05-19T18:22:32.743Z",
    "updatedAt": "2018-05-19T18:22:32.743Z",
    "userId": 2
  },
  {
    "id": 4,
    "message": "I don't trust anyone like I trust my dog.",
    "isPublic": false,
    "createdAt": "2018-05-19T18:22:32.743Z",
    "updatedAt": "2018-05-19T18:22:32.743Z",
    "userId": 2
  }
]
```

First we need to make sure we are returning only the public secrets. Before we write the code, we will need to write the test. Open up `/server/api/secrets.solution.spec.js` and take a look at the structure. Note that a lot of the prep work has been filled in for you. We have a beforeEach method at the beginning of the first describe block that achieves two things. First it seeds the database with data from a seed file. 

Second it finds the user with id 1, and two private secrets which we will need later. One that belongs to user 1 and one that does not.

## Guests Should Not See Private Secrets

Let's write our first test. Find the first it block in the file:

```javascript
it('should return only the secrets which are public'); 
```
* Add an arrow function as the second argument for the `it` method
* Use request(app) to make a get request to `/api/secrets`
* Expect that the api responds with a 200 status
* Then take the `res`ponse and check the body to make sure it's an array
* And that the body has a length of 2, since there are only 2 public secrets in the seed file
* Finally write two expect methods to test that each of the 2 secrets has isPublic set to true

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
      expect(res.body[1].isPublic).to.equal(true);
    });
});
```
Let's run the test and make sure it fails. I've set up a test-watch script for this workshop. Try it by running `npm run test-watch`.

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

## Authenticated Users Should See Their Own Private Secrets

Now we need to build another test for when an authenticated user grabs all the secrets. In addition to all the public secrets, they should also grab their own private ones. First let's write the test. Find this it method:

```javascript
it('should return public secrets and their private secrets');
```
It should be in the middle of the file, part of the 'with authenticated user' describe block. 

Before you begin, take a look at the beforeEach for this section. For these tests it first logs in an authenticated user. To do this we use an agent created by the request.agent() method. Then in the before each we use that agent to log in. Notice that we added an assertion within the beforeEach block which tests to make sure that the login succeeded. Now we are ready to do the actual test.

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
      expect(res.body.length).to.equal(3);
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

Lastly, we want to make one more change. We want to hide the actual userIds in the secret data from the API. We could just prevent that info from being sent altogether, but we do need the userId when it matches the current user. So we have one more test to fill in. Look for the it block like this:

```javascript
it('should not return the userId or any data besides the message');
```
Since this user is within the 'guest' describe , we want to use the basic request(app) to run this test. Add an arrow function to this `it` method and then:
* Use the request(app) method to get `/api/secrets`
* Once again expect 200 as the response status
* Then take the result and verify that the userId of the first secret returned is `null`.

Why not just roll this test into the other test just before it? You could, but this is testing for different behavior than the one above. My general rule is if it's testing different behavior, it should be separated into a different it statement.

Now that we have our newly failing test. Let's fix the code to make this work. One way we can do it, is to take the secrets array and map it to another array that alters the userId if it doesn't match the current user.

<details><summary><strong>Solution:</strong></summary>

```javascript
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
```

</details><br />

Check the tests, is everything passing again? If so, let's move on to the POST route.

*Next:* **[02 Posting New Secrets](./02_Posting_New_Secrets.md)**