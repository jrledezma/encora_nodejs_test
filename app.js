require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const { getAll, getById, insertData } = require('./db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.get('/notes', async (req, res) => {
	try {
		const notesResult = await getAll(req.query.author);
		res.status(200).json(notesResult.length ? { notes: notesResult } : []);
	} catch (ex) {
		console.log(ex);
		res.status(500).send(ex);
	}
});

app.get('/notes/:id', async (req, res) => {
	try {
		const noteResult = await getById(req.params.id);
		if (!noteResult) {
			res.sendStatus(404);
			return;
		}
		res.send({ note: noteResult });
	} catch (ex) {
		res.status(500).send(ex);
	}
});

app.post('/notes', async (req, res) => {
	try {
		if (!req.body.author || !req.body.content) {
			res.sendStatus(422);
			return;
		}
		await insertData(req.body);
		res.sendStatus(201);
	} catch (ex) {
		res.status(500).send(ex);
	}
});

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
