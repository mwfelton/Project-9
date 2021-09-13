
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


router.post('/courses', asyncHandler(async (req, res)=>{
    try {
        const courseBody = req.body;
  
        //* adds userId to req.body if the user is authenticated
        courseBody.userId = req.currentUser.id;
  
        const course = await Course.create(courseBody);
        res.status(201).location(`/api/courses/${course.id}`).end();
      } catch (err) {
        console.log("Error ", err.name);
  
        // * checks the type of Sequelize error
        if (err.name === "SequelizeValidationError") {
          const errors = err.errors.map((err) => err.message);
          res.status(400).json({ errors });
        } else {
          // * if not a validation or unique constraint error throw an error thats caught by global err handler
          throw err;
        }
      }
    })
  );

router.put('/courses/:id', asyncHandler(async (req, res)=>{
    try {
        const course = await Course.findByPk(req.params.id);
  
        if (course) {
          // checks if the course belongs to the current user
          if (req.currentUser.id === course.userId) {
            // * update the database
            await course.update(req.body);
            res.status(204).json({ message: "Course Updated" });
          } else {
            res
              .status(403)
              .json({ message: "You are not authorized to edit this coures" });
          }
        } else {
          res.status(404).json({ message: "Course Not found" });
        }
      } catch (err) {
        console.log("Error ", err.name);
  
        // * checks the type of Sequelize error
        if (err.name === "SequelizeValidationError") {
          const errors = err.errors.map((err) => err.message);
          res.status(400).json({ errors });
        } else {
          // * checks the type of Sequelize error
          throw err;
        }
      }
    })
  );


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