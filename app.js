
/**
 * Module dependencies. TODO: 第1章  页面权限控制
 */

var express = require('express');
var routes = require('./routes');

var http = require('http');
var path = require('path');

var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');



var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
//app.use(express.logger('dev'));

//app.use(express.bodyParser());
//保留文件上传的后缀名，并把文件保存在public/images/upload文件夹下
app.use(express.bodyParser({ keepExtensions: true, uploadDir: './public/images/upload' }));
app.use(express.urlencoded());
app.use(express.json());

app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({
    secret: settings.cookieSecret,
    key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
        db: settings.db
    })
}));


app.use(app.router);
//app.use(express.router(routes));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
routes(app);
