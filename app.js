// Create a website that allows people to post messages to a page. A message consists of a title and a body.
// The site should have two pages:
// - The first page shows people a form where they can add a new message.
// - The second page shows each of the messages people have posted.
// Make sure there's a way to navigate the site so users can access each page.

// Messages must be stored in a postgres database. Create a "messages" table with three columns:
// column name / column data type:
// - id: serial primary key
// - title: text
// - body: text

// required modules 
const express = require('express'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('express-session'),
    morgan = require('morgan'),
    app = express(),
    ejs = require('ejs'),
    path = require('path'),
    Models = require('./models/Models.js'),
    User = Models.User,
    Post = Models.Post,
    Comment = Models.Comment,
    bcrypt = require('bcrypt');

const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
// app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: true
}));

app.use(cookieParser());
app.use(cookieSession({
    name: 'userCookie',
    secret: 'secretSignature',
    resave: false,
    saveUninitialized: false
}));

// set view engine
app.set('view engine', 'ejs');

// setup path to 'views' folder
app.set('views', path.join(__dirname, 'views'));

// setup path to 'public' folder
app.use('/public', express.static(__dirname + '/public'));

// render index page
app.get('/', (req, res) => {
    console.log('index rendered');
    res.render('index')});

// renders a page with a post form to add messages on the index page
app.get('/addpost', (req, res) => {
  console.log('addpost rendered')
  res.render('addpost')});

// sync Message
Post.sync

// create a route for posting a post to index from addpost
app.post('/addpost', (req, res) => {
      console.log(req.body)
        Post.create({
                Title: req.body.Title,
                Body: req.body.Body
            })
            .then(() => {
                res.redirect('/allposts');
            })
            .catch((error) => {
                console.log(`Something went wrong when adding a post: ${error.stack}`);
                res.redirect('/addpost');
            });
    });

// GET method to getting all the posts on the index page
    app.get('/allposts', (req, res) => {
        Post.findAll().then((retrievedPostsArray) => {
            let dataRetrievedPostsArray = retrievedPostsArray.map((retrievedPosts) => {
                return {
                    title: retrievedPosts.dataValues.Title,
                    body: retrievedPosts.dataValues.Body
                };
            })
            res.render('allposts', {
                allposts: dataRetrievedPostsArray
            })
    
        }, (error) => {
            console.log(`Something went wrong when reading with findAll(): ${error.stack}`)
        });
    
    });

// Setup middleware that checks if user is logged in and redirects to their profile
let checkLoggedIn = (req, res, next) => {
    console.log(`cookie: ${req.cookies.userCookie}`);
    console.log(`user: ${req.session.user}`);

    if (req.session.user && req.cookies.userCookie) {
        console.log('checkLoggedIn found that user was already logged in.');
        res.redirect('/profile');
    } else {
        console.log('checkLoggedIn found that user is new here.');
        next();
    }
};

// Render profile page
app.get('/profile', (req, res) => {
    console.log('cookie:', req.cookies.userCookie)
    console.log('user:', req.session.user)
    if (req.session.user && req.cookies.userCookie) {
      res.render('profile', {
        user: req.session.user
      });
    } else {
      res.redirect('/')
    }
  });

// Route to register page
app.route('/register')
    .get(checkLoggedIn, (req, res) => {
        res.render('register');
    })
    .post((req, res) => {
        bcrypt.hash(req.body.password, 11).then((hashedPassword) => {

        User.create({
                username: req.body.username,
                password: req.body.password
            })
            .then((retrievedUser) => {
                req.session.user = retrievedUser.dataValues;
                res.redirect('/profile');
            })
            .catch((error) => {
                console.log(`Something went wrong when registering: ${error}`);
                res.redirect('/register');
            });
        }).catch((error) => {
            console.log(`Something went wrong when hashing password ${error}`)
        })
    });

// Route for logging in, checks if there is a user with that password, if correct, it will redirect to profile
app.route('/login')
    .get(checkLoggedIn, (req, res) => {
        res.render('login');
    })
    .post((req, res) => {
        let username = req.body.username,
            password = req.body.password;
        console.log(`login username: ${username}`);
        console.log(`password username: ${password}`);

        User.findOne({
                where: {
                    username: username,
                    password: password
                }
            })
            .then((retrievedUser) => {
                bcrypt.compare(password, retrievedUser.dataValues.password).then((result) => {
                    if (!result) {
                        console.log(`Error: Password does not match`);
                        res.render('error');
                    } else {
                        req.session.user = retrievedUser.dataValues;
                        console.log('Session user:', req.session.user);
                        res.redirect('/profile')
                    }
                }).catch((error) => {
                    `Something went wrong when comparing password`
                    res.render('error');
                })
            })
            .catch((error) => {
                console.log(`Something went wrong when logging in: ${error}`);
                res.render('error');
            });
    })

// Route for logging out, clear the cookie
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.userCookie) {
        res.clearCookie('userCookie');
        console.log('COOKIE HAS BEEN DELETED');
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

app.listen(port, () => console.log(`Got ears on ${port}`));

