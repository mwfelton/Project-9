'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

// my code
// const { sequelize } = require("./models");
const { sequelize } = require('./models')
const { Sequelize } = require('sequelize');


// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// app.use(express.json())

// setup morgan which gives us http request logging
app.use(morgan('dev'));

//my modular routes

const users = require('./routes/users');
const courses = require('./routes/courses');

app.use('/api', courses)
app.use('/api', users)

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found, find it!!!!',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

//My Code

app.set('port', process.env.PORT || 5555);

(async () => {
  try {
    // Test the connection to the database
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch(error) {
    console.log('unable to connect to the');
  }
})();

//Syncing Models and listening on port

sequelize.sync().then( () => {
  const server = app.listen(app.get('port'), () => {
    console.log(`Express server is listening on port ${server.address().port}`);
  }); 
  console.log('SYNCED UP EVERYTHING!!!!!!')
});