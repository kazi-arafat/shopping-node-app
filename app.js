// const http = require("http");
const path = require('path');

const express = require("express");
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/adminRouter');
const shopRoutes = require('./routes/shopRouter');
const errorController = require('./controllers/errorController');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','pug');
app.set('views','views');

// Pass route through middleware 
app.use('/admin', adminRoutes);
app.use(shopRoutes);


// For Error handling 404
app.use(errorController.error404);


// Using Middleware in express
// app.use((req, res, next) => {
//     console.log('In a middleware!');
//     next(); // Allows the request to continue next middleware in line
// });
// const server = http.createServer(app);
// server.listen(3000);

app.listen(3000);
