const express = require('express');
const app = express();
const path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

var port = process.env.PORT || 3000;
app.listen(port);