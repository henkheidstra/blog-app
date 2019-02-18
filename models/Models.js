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
const User = connection.define('User', {
    username: Sequelize.STRING,
    password: Sequelize.STRING
  });

// Define the Posts model.
const Post = connection.define('Post', {
    Title: Sequelize.STRING,
    Body: Sequelize.TEXT
  });

// Define the Comment model.
const Comment = connection.define('comments', {
    Comment: Sequelize.TEXT
});

Post.hasMany(Comment);
Comment.belongsTo(Post);
User.hasMany(Post);
Post.belongsTo(User);

// Create table based on the models above.
connection.sync({force:true})
    .then(() => console.log(` User, Post & Comment tables have been created!`))
    .catch((error) => console.log(`couldn't create table, here is the error which occured: ${error}`));

module.exports = {
    User: User,
    Post: Post,
    Comment: Comment
};