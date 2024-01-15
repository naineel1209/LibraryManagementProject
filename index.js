require('express-async-errors');
require('dotenv').config();

const express = require('express');
const app = express();
const morgan = require('morgan');
const winston = require('winston');
const logger = require('./config/winstonConfig');
const { message } = require('./model/userModel');
const cookieParser = require('cookie-parser');
const { verifyToken } = require('./middlewares/authMiddleware')

const PORT = process.env.PORT || 3000;

// delete require.cache[require.resolve('./data/books.json')];
// delete require.cache[require.resolve('./data/users.json')];
// delete require.cache[require.resolve('./data/rentOrders.json')];

//parsing the requests and body data
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(cookieParser());

//logging the incoming requests
app.use(morgan('dev'))
app.use(morgan('combined', {
    stream: {
        write: message => logger.info(message.trim())
    }
}))

app.get('/', (req, res) => {
    res.send("Hello World!!")
})

//routes
app.use('/register', require('./routes/registerRoutes'))
app.use('/login', require('./routes/loginRoutes'))
app.use('/logout', require('./routes/logoutRoutes'))

//protectedRoute
app.use('/books', verifyToken, require('./routes/booksRoutes'))
app.use('/books-helper', verifyToken, require('./routes/booksHelperRoutes'))
app.use('/profile', require('./routes/profileRoutes'))

//error handler
app.use((err, req, res, next) => {
    logger.error("Error: " + err.message)
    res.statusMessage = err.statusMessage || "Something went wrong";
    return res.status(err.statusCode || 500).json({
        message: err.message,
        status: err.statusCode || 500
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})