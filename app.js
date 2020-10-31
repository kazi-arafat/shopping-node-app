// const http = require("http");
const path = require('path');

const express = require("express");
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/adminRouter');
const shopRoutes = require('./routes/shopRouter');
const errorController = require('./controllers/errorController');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','pug');
app.set('views','views');

app.use((req, res, next) => {
    User.fetchById('5f9d827ac617a685d93512bc')
        .then(user =>{
            req.user = new User(user.name,user.email,user.cart,user._id);
            next();
        })
        .catch(err => console.error(err));
});

// Pass route through middleware 
app.use('/admin', adminRoutes);
app.use(shopRoutes);


// For Error handling 404
app.use(errorController.error404);

mongoConnect(() => {
    app.listen(3000);
});
