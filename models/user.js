'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init({

    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
    },
    emailAddress: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
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

// (async () => {
//     await sequelize.sync({ force: true });
  
//     try {
//       const userTest = await User.create({
//         firstName: 'Toy Story'
//       });
//       console.log(userTest.toJSON());
//       console.log('cheese pants')
  
//     } catch (error) {
//       console.error('Error connecting to the database: ', error);
//     }
//   })();