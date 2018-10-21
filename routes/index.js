const express = require('express');
const router = express.Router();

/* GET request to HOME page. */
router.get('/', (req, res) =>
{
  res.render('index', { title: 'Study Buddies - Home',
                        cssOne: 'grayscaleHome.css',
                        cssTwo: 'twoHome.css'
                      });
});

/* GET request to LOGIN form page. */
router.get('/login', (req, res) =>
{
  res.render('login', { title: 'Study Buddies - Login',
                        cssOne: 'loginUtil.css',
                        cssTwo: 'loginMain.css'
                      });
});

/* GET request to SIGNUP form page. */
router.get('/signup', (req, res) =>
{
  res.render('signup', { title: 'Study Buddies - SignUp',
                        cssOne: 'formSignUp.css'
                      });
});

module.exports = router;
