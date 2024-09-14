
const mongoose = require('mongoose');
require('dotenv').config()
var mongoDB = process.env.MONGODB_STRING

async function connectDatabase() {

    try {
        const connected = await mongoose.connect(mongoDB);
        console.log("connected");
        console.log(connected.connection.host);
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectDatabase