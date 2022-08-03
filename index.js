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

app.get('/', (req, res) => {
    let selectQuery = `select * from books`;
    connection.query(selectQuery, (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.render('view', {books: result});
        }
    })
})

app.get('/book/create', (req, res) => {
    res.render('create');
})

app.post('/book/create', upload.none(), (req, res) => {
    let book = req.body;
    const insertQuery = `insert into books(name, price, quantity, author) values ('${book.name}', ${book.price}, ${book.quantity}, '${book.author}')`;
    connection.query(insertQuery, (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.redirect(301, '/')
        }
    })
})

app.get('/book/edit', (req, res) => {
    let id = req.query.id;
    let selectQuery = `select * from books where id=${id}`
    connection.query(selectQuery, (err, result) => {
        res.render('edit', {book: result[0]});
    })
})

app.post('/book/edit', upload.none(),(req, res) => {
    let id = req.query.id;
    let book = req.body;
    let updateQuery = `update books set name='${book.name}', price=${book.price}, quantity=${book.quantity}, author=${book.author} where id=${id}`;
    connection.query(updateQuery, (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.redirect('/')
        }
    })
})

app.get('/book/delete', (req, res) => {
    let id = req.query.id;
    let deleteQuery = `delete from books where id=${id}`;
    connection.query(deleteQuery, (err, result) => {
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
})

app.listen(port, () => {
    console.log(`Running localhost:${port}`)
})
