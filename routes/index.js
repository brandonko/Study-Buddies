const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) =>
{
  res.render('index', { title: 'Express' });
});

router.get('/login', (req, res, next) =>
{
  res.render('login', { title: 'Study Buddies Login', cssOne: 'loginUtil.css', cssTwo: 'loginMain.css' });
});

module.exports = router;
