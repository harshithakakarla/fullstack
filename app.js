const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'trackwise',
    resave: false,
    saveUninitialized: true
}));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'harshitha2610', 
    database: 'trackwise'
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected");
});


// HOME
app.get('/', (req, res) => {
    res.render('home');
});


// LOGIN PAGE
app.get('/login', (req, res) => {
    res.render('login');
});


// LOGIN CHECK
app.post('/login', (req, res) => {

    const { username, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE username=? AND password=?",
        [username, password],
        (err, results) => {

            if (results.length > 0) {

                req.session.user = results[0];
                res.redirect('/main');

            } else {

                res.send("Invalid Login");

            }

        }
    );
});


// MAIN PAGE
app.get('/main', (req, res) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('main');
});


// ADD EXPENSE
app.post('/add', (req, res) => {

    let { title, amount, category, expense_date } = req.body;

    // If date is empty, set today's date
    if (!expense_date) {
        const today = new Date().toISOString().split('T')[0];
        expense_date = today;
    }

    db.query(
        "INSERT INTO expenses (title, amount, category, expense_date) VALUES (?, ?, ?, ?)",
        [title, amount, category, expense_date],
        (err) => {
            if (err) throw err;
            res.redirect('/output');
        }
    );
});

// OUTPUT PAGE
app.get('/output', (req, res) => {

    const salary = req.session.user.salary;

    // Get all expenses
    db.query("SELECT * FROM expenses", (err, expenses) => {

        if (err) throw err;

        // Total expenses
        db.query("SELECT SUM(amount) AS totalExpense FROM expenses", (err, totalResult) => {

            const totalExpense = totalResult[0].totalExpense || 0;

            const remaining = salary - totalExpense;

            // Category wise summary
            db.query(
                "SELECT category, SUM(amount) AS total FROM expenses GROUP BY category",
                (err, categories) => {

                    res.render('output', {
                        salary: salary,
                        totalExpense: totalExpense,
                        remaining: remaining,
                        expenses: expenses,
                        categories: categories
                    });

                }
            );

        });

    });

});


// DELETE EXPENSE
app.get('/delete/:id', (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM expenses WHERE id = ?",
        [id],
        (err) => {

            if (err) throw err;

            res.redirect('/output');

        }
    );

});


// SERVER
app.listen(3000, () => {

    console.log("Server running at http://localhost:3000");

});