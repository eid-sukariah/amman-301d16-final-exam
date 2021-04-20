'use strict'

// i have this problem :Error: Forbidden ;and could not solve it so i didn't finish.


// Environment variables
require('dotenv').config();

// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');


// Application Setup
const app = express();
const PORT = process.env.PORT || 3003;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({extended : true}))
// Specify a directory for static resources
app.use(express.static('./public'))
// define our method-override reference
// app.use(methodOverride, ('_method'));
// Set the view engine for server-side templating
app.set('view engine', 'ejs');
// Use app cors
app.use(cors())

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/', getAllData);
app.post('/favorite-quotes', saveQout)


// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function getAllData(req, res){
    
    const url = `https://thesimpsonsquoteapi.glitch.me/quotes?count=10`;
    
    // console.log('efwef');
    superagent.get(url).set('User-Agent', '1.0').then(x => {
        console.log(x.body);
        const apiData = x.body.map(obj => new Qutes(obj));
        // res.send('dgs')
        res.render('home', {data: apiData});
    }).catch(error => console.log(`api error ${error}`))
}

function saveQout(req, res){
    const sql = `INSERT INTO users (quote, character, image, characterDirection) VALUES($1 , $2, $3 , $4);`;
    const {quote, character, image, characterDirection} = req.body;
    const safeVal = [quote, character, image, characterDirection];

    client.query(sql, safeVal).then(data =>{
        res.redirect('favorite');
    })
}
// helper functions
function Qutes(info){
    this.quote = info.quote;
    this.character = info.character;
    this.image = info.image;
    this.characterDirection = info.characterDirection;
}
// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
