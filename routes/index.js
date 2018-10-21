const express = require('express');
const router = express.Router();

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

router.get('/signup', (req, res, next) =>
{
  res.render('signup', { title: 'Study Buddies - SignUp',
                        cssOne: 'formSignUp.css'
                      });
});

// formSignUp.css

module.exports = router;
