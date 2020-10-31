const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://admin_shoppingApp:HuG9ISReyR1okvRT@clustershoppingapp.jmrlv.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected!!');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
};

const getDb = () =>{
    if(_db){
        return _db;
    }
    throw 'No Database Found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
