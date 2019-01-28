const Sequelize = require('sequelize');

// sequelize setup
const connection = new Sequelize('blog-app', 'POSTGRES_USER', 'POSTGRES_PASSWORD', {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
}});

// Define the User model.
const User = connection.define('users', {
    email: {
      type: Sequelize.STRING,
      isEmail: {
        args: true,
        msg: 'The used e-mail address is already registered'
      },
      unique: true,
      allowNull: false,
      notEmpty: true
    },
    password: {
      type: Sequelize.STRING,
      notEmpty: true,
      allowNull: false
    },
  });

User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(Comment);
Comment.belongsTo(User);

  // Create table based on the User Model above.
connection.sync({force:true})
.then(() => console.log(`posts table has been created!`))
.catch((error) => console.log(`couldn't create table, here is the error which occured: ${error}`));

module.exports = User;