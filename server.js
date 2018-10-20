const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Should load /views/index.html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/index', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/forum', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/forum.html'));
}); 

app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/about.html'));
}); 

app.get('/contact', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/contact.html'));
}); 

app.get('/post', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/post.html'));
}); 

const port = process.env.PORT || 3000;
app.listen(port, function ()
{
 console.log(`http://localhost:${port}.`);
//  console.log(`Server running at http://192.168.1.9:' + port + '/')
})

