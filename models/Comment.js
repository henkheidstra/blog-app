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

// Define the Users model.
const Comment = connection.define('comments', {
    Comment: Sequelize.TEXT
});

// Create table based on the User Model above.
connection.sync({force:true})
    .then(() => console.log(`Comments table has been created!`))
    .catch((error) => console.log(`couldn't create table, here is the error which occured: ${error}`));

module.exports = Comment;