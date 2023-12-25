const { MongoClient } = require("mongodb");

let dbConnection;
module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect("mongodb://localhost:27017/bookstore")
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  }, //establish a connection with a database
  getDb: () => dbConnection, //return that connection from the database after it is connected
};
