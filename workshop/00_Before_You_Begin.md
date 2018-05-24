# Before You Begin

## Setup

Make sure to do the following steps before you begin:

* Fork and clone: [https://github.com/mullaney/secrets](https://github.com/mullaney/secrets)
* `npm install`
* `createdb secrets` & `createdb secrets-test`
* `npm run seed`

## Try the application

Now startup the dev server using `npm run start-dev` and go to [http://localhost:8080/](http://localhost:8080/) to try out the app. Here are some things for you to try: 

* Create an account using the sign up link
* Creating a new secret
* Create 2nd new secret and use the slider to make it public
* Create a third secret and then delete it
* Log out

After you log out, can you still see the public secret you made? Can you see the private ones? Are you able to change the privacy status of any secrets? Can you delete any of the secrets? As an unathenticated user, you should:

* Only see public secrets
* See the author of all secrets as 'anonymous'
* Not see any buttons which allow you to change or delete the secrets

Now make another new user and log in. Can you see the private secret of the first user? Can you update or delete them?

It would appear that the application is secure. Users cannot see each other's private secrets. They can't change or delete secrets except their own. And they can't see anything that identifies the user that published a public secret.

Hooray! It's perfect!

## But Is It Secure?

If you are still logged in, sign out of the app and then go to the following link:

[http://localhost:8080/api/secrets](http://localhost:8080/api/secrets)

See that? It's not secure. Not only can you see all the secrets, you can see the id numbers of the user who created each secret. It gets worse, you don't even need to know the api route. Just open up the console and look at the redux logger. You can see the secrets there.

But it's worse still. With the dev server still running, open up a new terminal window and try this command:

```
curl -X "DELETE" http://localhost:8080/api/secrets/1
```
Using simple curl commands. Anyone can post new secrets, update them (including changing the user id), and delete them. This is about as insecure as it gets.

## So what's the plan?

The API is in bad shape right now. All of our routes are insecure, but we can fix them! We can make our Secrets Application more private. And we are going to use Test Driven Development to get us there.

**But why are you making us use tests?!?!?!? Tests are hard to write! They double or even triple our coding time!**

Tests can be hard to write, especially if you have never seen a test similar to the one you want to write. But writing them will save you time. Why? Because making a change and rerunning your tests will take a few seconds. Doing the same thing with postman, or curl or some other method that requires you to manually try each route would be tedious, and much more time consuming than just writing the tests.

And this workshop will show you how to write those tests, which will make the whole process much easier. 

So are you ready to begin? Let's do it!

**[01 Keeping Private Secrets Private](./01_Keeping_Private_Secrets_Private.md)