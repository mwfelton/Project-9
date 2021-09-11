'use strict';
const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({

    title: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: {
          msg: 'Title is required'
        },
        notEmpty: {
          msg: 'Provide a valid title'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull:{
          msg: "Description must be provided"
        },
        notEmpty: {
          msg: 'Provide a valid description'
        }
      }
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING,
  }, { sequelize,
       modelName: 'Course'
      });

      Course.associate = (models) => {
        Course.belongsTo(models.User,{ 
            as: "userInfo", //alias
            foreignKey: {
                fieldName: 'userId'
            }
        })
    };

  return Course;
};