const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async(req, res) => {
    try{
        const { email, password } = req.body;

        if( !email || !password ){
            return res.status(400).render('login', {
                message: "Please prove email and password"
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            console.log(results);
            if(!results || !(await bcrypt.compare(password, results[0].password))){
                res.status(401).render('login', {
                    message: 'Email Or Password is Incorrect'
                })
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log('The Token Is: ' + token );
                
                const cookieOptions = {
                    expires: new Date(
                        Date.now + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");
            }
        } )

    } catch (error) {
        console.log(error)
    }
}


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