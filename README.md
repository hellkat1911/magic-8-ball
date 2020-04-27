# Magic 8-Ball 🎱

A magic 8-ball emulator web app.

<hr />

### Dependencies

1. [Nodemon](https://nodemon.io/) - automatically restarts the server after code changes & errors
1. [Mocha](https://mochajs.org/) - unit testing
1. [Chai](https://www.chaijs.com/) - a BDD / TDD assertion library for unit testing

The production app requires zero dependencies, except for [Node.js](https://nodejs.org) to be installed on the target system (version 12.16.2 preferred).

### Setup

1. Clone the app from the repo
1. Run `npm install` to install dependencies
1. Run one of the scripts listed below to start the app

### Scripts

##### `npm run dev`

Spins up the server and watches for changes to server-side code.

Port is set to 21337.

##### `npm run start`

Kicks off the Node server for a production environment.

##### `npm run test`

Run the included unit tests for the "history" API.

<hr />

author: [Justin Yarbrough](https://twitter.com/hellkat_)