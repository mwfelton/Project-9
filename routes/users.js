const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models')
const router = express.Router();
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require("../middleware/async-handler");
const bodyParser = require('body-parser');

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
    console.log(req.body)
    try {
        const user = await User.build(req.body);
        if (user.password) {
            user.password = bcrypt.hashSync(user.password, 10);
        }
        await user.save()
        res.status(201).location('/').end()
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError' || e.name === 'SequelizeValidationError') {
            const errors = e.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw e;
        }
    }
}))


module.exports = router;
