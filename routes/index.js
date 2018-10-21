const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
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
router.post('/auth', (req, res) =>
{
  var auth = true;
  var userEmail = req.body.email;
  var userPass = req.body.password;
  db.collection("users").find({email : userEmail}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    if (result.length == 0 || result[0].password !== userPass) {
      console.log('unsuccessful authentication');
      res.render('login', { title: 'Study Buddies - Login',
        cssOne: 'loginUtil.css',
        cssTwo: 'loginMain.css'
      });
    } else {
      console.log('successful authentication');
      userName = result[0].first_name;
      res.render('channel', {title: 'Channels',
        auth: true,
        userName: userName
      })
    }
  })
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

/* POST request from channel page, add post to database */
router.post('/store', function(req, res) {
  req.body.author = userName;
  let myData = new Post(req.body);
  myData.save();
  console.log("added: " + JSON.stringify(req.body) + " to mongodb");
  res.render('channel', {title: 'Channels',
        auth: true,
        userName: userName})
});

module.exports = router;
