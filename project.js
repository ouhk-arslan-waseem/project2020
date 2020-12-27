const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const http = require('http');
const url = require('url');

const mongourl = 'mongodb+srv://project2020:project2020@cluster0.635gp.mongodb.net/project2020?retryWrites=true&w=majority';
const dbName = 'restaurant';
const client = new MongoClient(mongourl);

app.set('view engine','ejs');

const SECRETKEY = '';

const users = new Array(
	{name: 'demo', password: ''},
	{name: 'student', password: ''}
);

app.set('view engine','ejs');

app.use(session({
  name: 'loginSession',
  keys: [SECRETKEY]
}));

// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => {
	console.log(req.session);
	if (!req.session.authenticated) {    //user not logged in
		res.redirect('/login');
	} else {
		res.status(200).render('secrets',{name:req.session.username});
	}
});

app.get('/login', (req,res) => {
	res.status(200).render('login',{});
});

app.post('/login', (req,res) => {
	users.forEach((user) => {
		if (user.name == req.body.name && user.password == req.body.password) {
			// correct user name + password
			// store the following name/value pairs in cookie session
			req.session.authenticated = true;        // 'authenticated': true
			req.session.username = req.body.name;	 // 'username': req.body.name		
		}
	});
	res.redirect('/mainmenu');
});

app.set('view engine','ejs');

app.get('/mainmenu', (req,res) => {
	res.write("<html><body>");
	res.write("<button>Create New Restaurant</button>");


});

app.get('/restaurant', (req,res) => {
	const insertDocument = (db, doc, res, callback) => {
		db.collection('bookings').
		insertOne(doc, (err, results) => {
		assert.equal(err,null);
		console.log("A document is stored." + JSON.stringify(doc));
		callback(results);
		});
	}	   
});

app.listen(process.env.PORT || 8099);
