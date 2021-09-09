'use strict';
const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({

    title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      },
      estimatedTime: {
        type: DataTypes.STRING
      },
      materialsNeeded: {
        type: DataTypes.STRING
      }

  }, { sequelize,
       modelName: 'Course'
      });

      Course.associate = (models) => {
        Course.belongsTo(models.User,{ 
            foreignKey: {
                fieldName: 'userId'
            }
        })
    };

  return Course;
};