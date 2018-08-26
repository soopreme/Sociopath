/*~~API For~~ 'Sociopath'
  created by eobsite1
  not that anyone will ever read this :/ */

//importing modules
const express = require('express');
const sql = require('sync-mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

//importing custom modules
const prender = require('./renderprofile.js');

//static variables
const saltRounds = 10;

//static functions
const app = express();
const con = new sql({
    host: 'localhost',
    user: 'root',
    database: 'ready'
});

//express app.use() stuff
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname));

/*post routes*/

//generate a token from username and password
app.post('/login', (req, res) => {
    var name = req.body.name;
    var pass = req.body.pass;
    if(!name || !pass) {
        return res.sendStatus(400);
    }
    var user = con.query(`SELECT * FROM users WHERE uname='${name}'`);
    if(!user[0]) {
        return res.sendStatus(403);
    }
    var pwValid = bcrypt.compareSync(pass, user[0].pword);
    if(!pwValid) {
        return res.sendStatus(403);
    }
    //TO DO: move to proper usage of jwt by creating a cert and signing some user specific data
    var token = jwt.sign({name}, pass);
    con.query(`REPLACE INTO tokenref (name, token) VALUES ('${name}', '${token}')`);
    res.cookie('sooToken', token);
    res.redirect('/profile');
});

/*get routes*/

//profiles
app.get('/profile', (req, res) => {
    user = con.query(`SELECT * FROM tokenref WHERE token='${req.cookies.sooToken}'`);
    if(!user[0]) {
        return res.sendStatus(403);
    }
    res.send(prender.self(user[0].name));
    res.end();
})
app.get('/profile/:id', (req, res) => {
    var id = req.params.id;
    if(Number.isInteger(id)) {
        res.send(prender.getById(id));
    } else {
        res.send(prender.getByName(id));
    }
})

//login
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
})

//listen on a port
app.listen(666);
console.log('listening on port 666');