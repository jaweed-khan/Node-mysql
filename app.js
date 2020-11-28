const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env' });

const app = express();

/**
 *  db connection getting values from .env
 */
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

/**
 * set the public directory for css and js
 */
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Parse URL - Encoded bodies as send by html forms
app.use(express.urlencoded({extended:false}));

// parse JSON Bodies (as Send by API Clients)
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');

db.connect( (error) => {
    if(error){
        console.log(error)
    }else{
    console.log('MYSQL Connected...')
    }
});

//Define Route

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5000, () =>{
    console.log("Server started on 5000");
})