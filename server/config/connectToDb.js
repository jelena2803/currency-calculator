const mongoose = require("mongoose");
require("dotenv").config();

//Establish connection with MongoDb
async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to database");
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectToDb;
