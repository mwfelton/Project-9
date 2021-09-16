
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


  router.post('/courses', authenticateUser, asyncHandler(async ( req, res ) => {
    try{
        let newCourse = req.body 
        const createCourse = await Course.create(newCourse)
        const { id } = createCourse
         res.status(201)
         .location(`/api/courses/${id}`)
         .end()
        }catch(error){
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
          } else {
            throw error;
          }
        }
}))

router.put('/courses/:id', authenticateUser, asyncHandler(async ( req, res ) =>{
  try{
      const course = await Course.findByPk(req.params.id)
          if( req.currentUser.id === course.userId ){
              if(course){
                  console.log('UPDATING COURSE')
                  await course.update(req.body)
                  res.status(204).end()
              }else{
                  res.status(404).end()
              }
          }else{
              res.status(403)
              .json({message: "Update Failed. User does not have permissions for requested course"})
          }
          
  }catch(error){
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
}))


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