# Keeping Private Secrets Private

*Previous:* **[00 Before You Begin](./00_Before_You_Begin.md)**

Let's start with the route that gets the secrets in the first place. When we visit [http://localhost:8080/api/secrets](http://localhost:8080/api/secrets) get something like this:

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

First we need to make sure we are returning only the public secrets. Before we write the code, we will need to write a test. The test will define what we are trying to do with our code. 

Open up `/server/api/secrets.spec.js` and take a look at the structure. Note that a lot of the prep work has been filled in for you. We have a beforeEach method at the beginning of the first describe block that achieves two things. 

1. It seeds the database with data from a seed file. 
2. It finds the user with id 1, and two private secrets which we will need later. One that belongs to user 1 and one that does not.

## Guests Should Not See Private Secrets

Let's write our first test. Find the first it block in the file:

```javascript
describe('guests', () => {
  describe('GET /api/secrets', () => {
    it('should return only the secrets which are public');
```
* Add an arrow function as the second argument for the `it` method
* Use request(app) to make a get request to `/api/secrets`
* Expect that the api responds with a 200 status
* Then take the `res`ponse and check the body to make sure it's an array
* And that the body has a length of 2, since there are only 2 public secrets in the seed file
* Finally write two expect methods to test that each of the 2 secrets has isPublic set to true

When you are done your test should look something like this:

<details><summary><strong>Solution Hint:</strong></summary>

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
</details><br />

Let's run the tests and make sure it fails. I've set up a test-watch script for this workshop. Try it by running `npm run test-watch`.

Your test should be failing, and our first step completed. Now let's look at the existing code and see if we can change it to pass our specs. You will find it in `/server/api/secrets.js`.

```javascript
router.get('/', (req, res, next) => {
  Secret.findAll()
  .then(secrets => res.status(200).json(secrets))
  .catch(next);
});
```
As you can see, it just grabs all the secrets and sends them out in the response. Instead, let's add a where condition to our .findAll method to only find secrets where isPublic is set to true. 

This should work:

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
router.get('/', (req, res, next) => {
  Secret.findAll({
    where: { isPublic: true }
  })
    .then(secrets => res.status(200).json(secrets))
    .catch(next);
});
```
</details><br />

Now the test you wrote just passed! If it didn't see if you can find your error using the error message.

## Authenticated Users Should See Their Own Private Secrets

Now we need to build another test for authenticated users. An aunthenicated user should get all the public secrets. But they should also get their own private ones too. First let's write the test! 

Find this it method. It will be in the 2nd half of the file:

```javascript
  describe('GET /api/secrets', () => {
    it('should return public secrets and their private secrets');
  });
```
It should be in the middle of the file, part of the 'with authenticated user' describe block. 

Before you begin, take a look at the beforeEach for this section. For these tests it first logs in an authenticated user. To do this we use an agent created by the request.agent() method. Then in the beforeEach we use that agent to log in. Notice that we added an assertion which tests to make sure that the login succeeded. Now we are ready to write the actual test.

* Add a get request to `/api/secrets`
* Expect a 200 response
* Then check to see if the response body is an array
* Finally check to see if the response body has a length of 3 (there are 2 public secrets and one private one that belongs to use 2)

The final test would look like this:

<details><summary><strong>Solution Hint:</strong></summary>

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
</details><br />

There are a few ways we could do this. For instance, we could return all the secrets and then use .filter on the resulting array. Or we could use a an operator that Sequelize provides. Check out this [documentation](http://docs.sequelizejs.com/manual/tutorial/querying.html#operators) and see if you can figure out a solution using Op.

Or use any solution you can to pass the test while still passing the previous one we wrote above.

<details><summary><strong>Solution Hint:</strong></summary>

Add this at the top of the file:

```javascript
const { Op } = require('sequelize');
```

And then change the route:

```javascript
router.get('/', (req, res, next) => {
  let where = { isPublic: true };
  if (req.user) {
    where = { [Op.or]: [{userId: req.user.id}, { isPublic: true }] }
  }

  Secret.findAll({ where })
    .then(secrets => res.status(200).json(secrets))
    .catch(next);
});
```
</details><br />

Note that if you need to make sure req.user exists before checking for req.user.id or you will get an error whenever the user is not signed in. Now our findAll will include all public secrets and all secrets owned by the current user.

Lastly, we want to make one more change. We want to hide the actual userIds in the secret data from the API. We could just prevent that info from being sent altogether, but the client does need the userId when it matches the current user. So we have one more test to fill in. Look for the it block near the beginning like this:

```javascript
it('should not return the userId or any data besides the message');
```
Since this user is within the 'guest' describe , we want to use the basic request(app) to run this test. Add an arrow function to this `it` method and then:
* Use the request(app) method to get `/api/secrets`
* Once again expect 200 as the response status
* Then take the result and verify that the userId of the first secret returned is `null`.

Why not just add this test into the other test just before it? You could, but this is testing for different behavior than the one above. My general rule is if it's testing different behavior, it should be separated into a different it block.

Now that we have our newly failing test. Let's fix the code to make this work. See if you can come up with a solution. Take a look at the first hint if you want a hint, and the second one if you want to see a solution.

<details><summary><strong>Solution Hint:</strong></summary>
<blockquote></blockquote>
</details>

<details><summary><strong>Solution Hint:</strong></summary>

```javascript
router.get('/', (req, res, next) => {
  let where = { isPublic: true };
  if (req.user) {
    where = { [Op.or]: [{userId: req.user.id}, { isPublic: true }] };
  }

  const userId = req.user && req.user.id ? req.user.id : null;
  Secret.findAll({ where })
    .then(result => {
      const secrets = result.map(secret => {
        return {
          id: secret.id,
          message: secret.message,
          isPublic: secret.isPublic,
          userId: secret.userId === userId ? userId : null
        };
      });
      res.status(200).json(secrets);
    })
    .catch(next);
});
```

</details><br />

Check the tests, is everything passing again? If so, let's move on to the POST route.

*Next:* **[02 Posting New Secrets](./02_Posting_New_Secrets.md)**