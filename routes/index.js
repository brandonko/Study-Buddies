const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const fs = require('fs');
var userName = "";

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

// Define schema for post
const PostSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  author: { type: String, default: userName },
  content: { type: String, trim: true },
  likes: { type: Number, default: 0 }
},
{timestamps: true});
const Post = mongoose.model('Post', PostSchema);
module.exports = Post;

// Define schema for user credentials
const UserSchema = new mongoose.Schema({
  first_name: { type: String, trim: true },
  last_name: { type: String, trim: true },
  email: { type: String, trim: true },
  password: { type: String, trim: true }
},
{timestamps: true});
const User = mongoose.model('User', UserSchema);
module.exports = User;

// Open up the DB for post
mongoose.connect("mongodb://localhost:27017/StudyBuddies", { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', () => { console.log("Connected to mongodb and working!")});
db.on('error', (err) => {console.error("Error!: ", err, "\n")});

/* GET request to HOME page. */
router.get('/', (req, res, next) =>
{
  res.render('index', { title: 'Study Buddies - Home',
    cssOne: 'grayscaleHome.css',
    cssTwo: 'twoHome.css'
  });
});

/* POST request from channel to log out */
router.post('/', (req, res, next) =>
{
  res.render('index', { title: 'Study Buddies - Home',
    cssOne: 'grayscaleHome.css',
    cssTwo: 'twoHome.css'
  });
});

/* GET request to LOGIN form page. */
router.get('/login', (req, res, next) =>
{
  res.render('login', { title: 'Study Buddies - Login',
    cssOne: 'loginUtil.css',
    cssTwo: 'loginMain.css'
  });
});

/* POST request from LOGIN page, authenticate credentials */
router.post('/auth', (req, res, next) =>
{
  let auth = true;
  let userEmail = req.body.email;
  let userPass = req.body.password;
  db.collection("users").find({email : userEmail}).toArray(function(err, result)
  {
    if (err)
    {
      throw err;
    }
    console.log("The result from db query: ", result);
    if (result.length == 0)
    {
      console.log("Result.length is 0, thus auth is false. Nothing in DB");
      auth = false;
    }
    else if (result[0].password !== userPass)
    {
      console.log("The password doesn't equal the password in DB!");
      auth = false;
    }
    else
    {
      console.log("successfull auth");
    }

    if (auth === true)
    {
      // authentication was successfull
      console.log("Authentication was successfull!");
      userName = result[0].first_name;

      res.render('channel', {title: 'Channels',
        auth: true,
        userName: userName
      })
    }
    else
    {
      // bad, auth didn't work. not successfull

      console.error("error when authenticating! 401 status");
      let err = new Error('Wrong email or Password!');
      err.status = 401;
      return next(err);
    }
  });
});

/* GET request to SIGNUP form page. */
router.get('/signup', (req, res, next) =>
{
  res.render('signup', { title: 'Study Buddies - SignUp',
    cssOne: 'formSignUp.css'
  });
});

/* POST request from SIGNUP page, add details into database*/
router.post('/register', (req, res) =>
{
  console.log("Req.body: \n", req.body);
  let myData = new User(req.body);
  myData.save()
  .then(item =>
  {
    console.log("Just added the user into db. From POST request from /register!");
    console.log("All information added to DB: ", item);
    // redirecting to login page upon successfull completion of signup
    res.render('login', { title: 'Study Buddies - Login', cssOne: 'loginUtil.css', cssTwo: 'loginMain.css' });
  })
  .catch(err =>
  {
    console.error("Can't save to database!");
    res.status(400).send("Unable to save to database");
  });
});

/* POST request from channel page, adds post to the database */
router.post('/store', (req, res) =>
{
  req.body.author = userName;
  let myData = new Post(req.body);
  myData.save()
  .then(item =>
  {
    console.log("successfull add to the DB for adding posts!");
    // let resultQuery = db.collection("posts").find();
    // console.log(resultQuery.body);
    // Posts.find({}, function(err, result)
    // {
    //   if (err)
    //   {
    //     throw err;
    //   }
    //   console.log("The result from db query: ", result.body);
    // })
    db.collection("posts").find({likes:0}, function(err, resFinal)
    {
      if (err) throw err;
      console.log("The final result from query from db: ", resFinal);
      db.close();
    });
  })
  .catch(err =>
  {
    console.error("Can't save to database!");
    res.status(400).send("Unable to save to database");
  })

  console.log("Just added the input from channel posts into db. From POST request from /store!\n", req.body);
  res.render('channel', {
                          title: 'Channels',
                          auth: true,
                          userName: userName
                          // postData:
                        }
            )

});

module.exports = router;
