'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init({

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a first name'
        },
        notEmpty: {
          msg: 'Please provide a first name'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a last name'
        },
        notEmpty: {
          msg: 'Please provide a last name'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address'
        },
        notNull: {
          msg: 'Please enter an email address'
        },
        notEmpty: {
          msg: 'Please provide a valid email address '
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a password'
        },
        notEmpty: {
          msg: 'Please provide enter a password'
        }
      }
    }
  }, { sequelize,
       modelName: 'User'
      });

      User.associate = (models) => {
        User.hasMany(models.Course, { 
          foreignKey: {
            fieldName: 'userId',
            allowNull: false 
          }
        })
      }

  return User;
};
