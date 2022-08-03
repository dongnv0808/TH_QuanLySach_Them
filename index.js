const express = require('express');
const app = express();
const mysql = require('mysql');
const multer = require('multer');
const upload = multer();
const bodyParser = require('body-parser');
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456aA@',
    database: 'dbBook'
})

connection.connect( err => {
    if(err){
        throw err.stack;
    } else {
        console.log('Connect success');
        const sqlCreate = `create table if not exists books(
            id int auto_increment primary key,
            name varchar(255),
            price int,
            quantity int,
            author varchar(255)
        )`
        connection.query(sqlCreate, (err, result) => {
            if(err){
                console.log(err);
            } else {
                console.log('Create success');
            }
        })
    }
})

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/create', (req, res) => {
    res.render('create')
})
app.post('/book/create', upload.none(), (req, res) => {
    let book = req.body;
    const insertQuery = `insert into books(name, price, quantity, author) values ('${book.name}', ${book.price}, ${book.quantity}, '${book.author}')`;
    connection.query(insertQuery, (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.render('success');
        }
    })
})

app.listen(port, () => {
    console.log(`Running localhost:${port}`)
})
