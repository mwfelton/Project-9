
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth-user');
const { asyncHandler } = require('../middleware/async-handler');
const { Course, User } = require('../models');


router.get('/courses', asyncHandler(async (req, res)=>{
    const courses = await Course.findAll({
        include: [
            {
                model: User,
                as: "userInfo",
                attributes: { exclude: ["password", "createdAt", "updatedAt"] },
              },
            ],
            attributes: { exclude: ["createdAt", "updatedAt"] },
          });
          res.json(courses);
        })
      );

router.get('/courses/:id', asyncHandler(async (req, res)=>{
    const course = await Course.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "userInfo",
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (course) {
        res.json(course);
      } else {
        res.status(404).json({ message: "Course Not found" });
      }
    })
  );


  router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
    try {
        // programmed so that the user that is logged in has his id as the userId of the course so no validation error is shown
        const course = await Course.build(req.body);
        course.userId = req.currentUser.id;
        await course.save();

        res.status(201).location(`/courses/${course.id}`).end();
    } catch (e) {
        if (e.name === 'SequelizeValidationError' || e.name === 'SequelizeUniqueConstraintError') {
            const errors = e.errors.map(err => err.message);
            res.status(400).json({ errors })
        } else {
            throw e;
        }
    }
}))

router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
  try {
      const course = await Course.findByPk(req.params.id);
      const user = req.currentUser;
      console.log(user.id, course.userId)
      if (course.userId === user.id) {
          if (course) {
              course.title = req.body.title;
              course.description = req.body.description;
              course.estimatedTime = req.body.estimatedTime;
              course.materialsNeeded = req.body.materialsNeeded;
              await course.save();
              await Course.update({ course }, { where: { id: req.params.id } })
              res.status(204).end()
          } else {
              res.status(404).json({ message: 'The course you want to update can not be found.' })
          }
      } else {
          res.status(403).json({ message: 'You don\'t have permission to edit this users courses only the owner can.' })
      }
  } catch (e) {
      if (e.name === 'SequelizeValidationError' || e.name === 'SequelizeUniqueConstraintError') {
          const error = e.errors.map(err => err.message)
          res.status(400).json({ error })
      } else {
          throw e;
      }
  }
}));


  router.delete(
    "/courses/:id",
    authenticateUser,
    asyncHandler(async (req, res) => {
      const course = await Course.findByPk(req.params.id);
  
      if (course) {
        if (req.currentUser.id === course.userId) {
          await course.destroy();
          res.status(204).end();
        } else {
          res
            .status(403)
            .json({ message: "You are not authorized to delete this coures" });
        }
      } else {
        res.status(404).json({ message: "Course Not found" });
      }
    })
  );
  
  module.exports = router;