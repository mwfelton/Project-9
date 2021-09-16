const express = require('express');

const { User } = require('../models')
const router = express.Router();
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require("../middleware/async-handler");

// A /api/users GET route that will return all properties and values for the currently authenticated User along with a 200 HTTP status code.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser
    res.json({
      id:user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    })
}));


// A /api/users POST route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).location("/").end();
    } catch (err) {
      console.log("Error ", err.name);

      // * checks the type of Sequelize error
      if (
        err.name === "SequelizeValidationError" ||
        err.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = err.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        // * checks the type of Sequelize error
        throw err;
      }
    }
  })
);


module.exports = router;
