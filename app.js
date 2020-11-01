const path = require('path');

const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/adminRouter');
const shopRoutes = require('./routes/shopRouter');
const errorController = require('./controllers/errorController');
const connectionUri = require('./util/database').connectionUri;
const User = require('./models/user');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','pug');
app.set('views','views');

app.use((req, res, next) => {
    User.findById('5f9e66cce3a06546c86ac783')
        .then(user =>{
            req.user = user;
            next();
        })
        .catch(err => console.error(err));
});

// Pass route through middleware 
app.use('/admin', adminRoutes);
app.use(shopRoutes);


// For Error handling 404
app.use(errorController.error404);

// console.log('Mongoose URI ', connectionUri);l

mongoose
    .connect(connectionUri,{
         useNewUrlParser: true,
         useUnifiedTopology: true
        })
    .then((result) =>{
        User
            .findOne()
            .then(user => {
                if(!user){
                    const user = new User({
                        name: 'Kazi',
                        email: 'example@example.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save()
                    console.log('User created');
                }
            });
    })
    .then(() =>{
        app.listen(3000);
    })
    .catch(err => console.log(err));