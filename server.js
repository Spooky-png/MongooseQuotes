const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views');
app.use(express.urlencoded());
const session = require('express-session');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:/quotes_db', { useNewUrlParser: true });

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 2},
    quote: {type: String, required: true, minlength: 6},
}, {timestamps: true })
const User = mongoose.model('User', UserSchema);

const flash = require('express-flash');
app.use(flash());
app.post('/users', (req, res) => {
    const user = new User();
    user.name = req.body.name;
    user.quote = req.body.quote;
    user.save()
        .then(newUserData => {
            console.log('User created: ', newUserData)
            res.redirect('/quotes');
        })
        .catch(err => {
            console.log("We have an error!", err);
            // adjust the code below as needed to create a flash message with the tag and content you would like
            for (var key in err.errors) {
                req.flash('registration', err.errors[key].message);
            }
            res.redirect('/');
        });
});

app.use(session({
    secret: '4235rfadsa32rq',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }))

app.post('/users', (req, res) => {
    const user = new User();
    user.name = req.body.name;
    user.quote = req.body.quote;
    user.save()
        .then(newUserData => {
            console.log('User created: ', newUserData)
            res.redirect('/quotes');
        })
        .catch(err => console.log(err));
})

app.get('/', (req, res) => {
    res.render("index")
});
app.get('/quotes', (req, res) => {
    User.find()
        .then(data => res.render("quotes", { Users: data.reverse() }))
        .catch(err => res.json(err));
});

app.listen(8000, function () {
    console.log("server running on port 8000");
});