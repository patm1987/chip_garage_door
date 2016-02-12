var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var garage_route = require('./routes/garage_route');
var not_authenticated_route = require('./routes/not_authenticated');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var keys = require('./keys.json');
var Users = require('./models/Users');
var users = new Users();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: 'supersecretsessionkey'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    users.get_user(id, function(user){
        if (user == null) {
            done("Couldn't find user", null);
        }
        else {
            done(null, user);
        }
    });
});

passport.use(new GoogleStrategy(
    {
        clientID: keys.google_key,
        clientSecret: keys.google_secret,
        callbackURL: 'http://localhost:3000/login/callback'
    },
    function (token, refreshToken, profile, done) {
        process.nextTick(function(){
            users.get_user(profile.id, function(user){
                if (user) {
                    return done(null, user);
                }
                else {
                    var name = profile.name.givenName + " " + profile.name.familyName;
                    return done(null, users.add_user(profile.id, profile.emails[0].value, name));
                }
            });
        });
    }
));

garage_route.set_passport(passport);

app.get('/login', passport.authenticate('google', {scope: ['profile', 'email']}), function (req, res) {
    console.log(req);
});
app.get(
    '/login/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    function(req, res) {
        res.redirect('/garage');
    }
);

app.use('/', routes);
app.use('/garage', garage_route);
app.use('/not_authenticated', not_authenticated_route);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
