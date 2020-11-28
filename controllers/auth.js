const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.register = (req, res) => {
    console.log(req.body);

    /**
     * Long method
     */
    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    /**
     * Short Method
     */
    const { name, email, password, passwordConfirm } = req.body;

    /**
     * Query Database
     */
    db.query("SELECT * FROM users where email = ?", [email], async (error, results) => {
        if(error){
            console.log(error);
        }

        if(results.length > 0){
            res.render('register', {
                message: 'That email is already in use'
            })
        } else if( password !== passwordConfirm ) {
            res.render('register', {
                message: 'Passwords do not match'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
            if(error){
                console.log(error);
            } else {
                console.log(results);
                res.render('register', {
                    message: 'User Registered '
                })
            }
        } )

    });
    
}