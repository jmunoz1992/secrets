# Secrets

An application for saving and anonymously sharing your personal secrets online. What could go wrong?

Securing an application is not just about restricting your client code. That may keep private information out of the hands of the average user. But you must also make your API secure as well. Secrets is an application which demonstrates that your client might seem secure even when your API is wide open.

Secrets contains two branches. First, you have a master branch which is insecure. This is the starting point for a workshop on how to write specs to test your API using authenticated users. The instructions for how to complete this workshop is under construction and should be available soon.

## Source

This project was built using [Boilermaker](https://github.com/FullstackAcademy/boilermaker), a boilerplate for creating web applications using node, express, sequelize, postgreSQL, react and redux. 

## Target Audience

Although anyone is welcome to fork this repo and try the workshop, this is particularly made for students of Fullstack Academy. If you want to know how to secure your express api routes, this workshop will help. You may also want to take a look at the specs for the react components (using enzyme) and for redux as well. These tests are already complete and part of the starting point for the workshop.

## Get Started

* Fork this repo and use `git clone` to copy it to your local machine
* Run `npm install` or (`yarn install`, if you prefer)
* Make sure you have postgreSQL running and create two databases named `secrets` and `secrets-test`
* Running `npm test` or `npm run test-watch` will run your tests
* Running `npm run start-dev` will start your local server and let you try out the application
* Running `npm run seed` will seed the database
* Instructions on how to do the workshop are in the `/workshop` folder

For more information about some of the other features of boilermaker, checkout their [readme file](https://github.com/FullstackAcademy/boilermaker/blob/master/README.md). 