const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const helmet = require('helmet');

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) =>
{
  let err = new Error('404, File Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next)
{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error', {
                        message: err.message,
                        title: `Error: ${err.status}`,
                        cssOne: 'error.css',
                        cssTwo: 'error.css',
                        error: {}
                      }
            );
});


// setup for socket.io
io.on('connection', function(socket){
	console.log('new connection made.');
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
});


http.listen(8080, () =>
{
   console.log(`Listening port 8080! http://localhost:8080`);
});
