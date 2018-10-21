const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const userName = "Ronan";

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

/* GET request to LOGIN form page. */
router.get('/login', (req, res, next) =>
{
  res.render('login', { title: 'Study Buddies - Login',
    cssOne: 'loginUtil.css',
    cssTwo: 'loginMain.css'
  });
});

/* POST request from LOGIN page, authenticate credentials */
router.post('/auth', (req, res) =>
{
  var auth = true;
  var userEmail = req.body.email;
  var userPass = req.body.password;
  db.collection("users").find({email : userEmail}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    if (result.length == 0) auth = false;
    else if (result[0].password !== userPass) auth = false;
    else console.log("successfull auth");
  });
  if (auth) {

  } else {
    res.render('login', { title: 'Study Buddies - Login',
      cssOne: 'loginUtil.css',
      cssTwo: 'loginMain.css'
    });
  }
});

/* GET request to SIGNUP form page. */
router.get('/signup', (req, res, next) =>
{
  res.render('signup', { title: 'Study Buddies - SignUp',
    cssOne: 'formSignUp.css'
  });
});

/* POST request from SIGNUP page, add details into database */
router.post('/register', (req, res) =>
{
  let myData = new User(req.body);
  myData.save();
  console.log("Just added the user into db");
  res.render('login', { title: 'Study Buddies - Login',
    cssOne: 'loginUtil.css',
    cssTwo: 'loginMain.css'
  });
})

module.exports = router;
