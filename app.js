var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
                  var cookieParser = require('cookie-parser');
                  var bodyParser = require('body-parser');
                  var session = require('express-session');
                  var passport = require('passport');
//----------------------------------------------------------------------
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');//-------users
var testRouter = require('./routes/test');
var dbRouter = require('./routes/db');
var postsRouter = require('./routes/posts');
var categoryRouter = require('./routes/category');
var toDoRouter = require('./routes/todo');
var budgetRouter = require('./routes/budget');//-------budgetCalculator
var uploadRouter = require('./routes/uploadImage');//-------img upload
var galleryRouter = require('./routes/gallery');
var loginTableRouter = require('./routes/loginTable');
var authRouter = require('./routes/auth');
var authPassportRouter = require('./routes/authPassport');
//-------------------------------------------------------------------------
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//---------------CookieParse & BodyParse & passport & SO ON[extra packages]-------------------------------------------------
app.use(cookieParser());
app.use(bodyParser.json());//Body parsse package
app.use(bodyParser.urlencoded({ extended: true }));

//Express session -> This works on application level
app.use(session({
  secret: 'login',
  resave: true,
  saveUninitialized: false
}));//session package

app.use(passport.initialize());//-------passprot
app.use(passport.session());//-------passportSession




var connection = require("./routes/dbConnction/databaseConnection");//-------For DB connection
passport.deserializeUser(function(id, done) {//-------passport Deserialize
  connection.query("SELECT * from users WHERE id = ?", id, function(err, user) {
    if(err) throw err;
    done(err, user[0]);
  });
});

passport.serializeUser(function(user, done) {//-------passport Sereialize
  done(null, user[0].id);
});

//---------------------------------------------------------------

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'files')));

//---------------------------------------------------------------
//Disable cors
app.use((req, res, next) => { //doesn't send response just adjusts it
  res.header("Access-Control-Allow-Origin", "*") //* to give access to any origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" //to give access to all the headers provided
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); //to give access to all the methods provided
    return res.status(200).json({ message: "CORS ERROR" });
  }
  next(); //so that other routes can take over
});

//----------------------------------------------------------------------------


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test', testRouter)
app.use('/db', dbRouter);
app.use('/posts', postsRouter);
app.use('/category', categoryRouter);
app.use('/todo', toDoRouter);
app.use('/loginTable', loginTableRouter);
app.use('/auth', authRouter);
app.use('/budget', budgetRouter);
app.use('/upload', uploadRouter);
app.use('/gallery', galleryRouter);
app.use('/authPassport', authPassportRouter);
//-----------------------------------------------------------------
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
