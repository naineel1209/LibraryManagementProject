const { connect } = require('mongoose');
require('dotenv').config();

const connect2db = async () => {
    await connect(process.env.MONGO_URI, {

    })
    console.log("Database Connected")
}

module.exports = connect2db;