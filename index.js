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
const connect2db = require('./database/connect2db.js')
const swaggerUi = require('swagger-ui-express');
const swaggerJson = require('./docs/swagger.json');
const specs = require('./docs/swaggerDef.js');
const swaggerJsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 3000;

//parsing the requests and body data
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(cookieParser());

// Serve the Swagger docs
app.use('/docs', express.static('docs'));   //serve the swagger docs
const swaggerDocs = swaggerJsdoc(specs);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
    logger.error("Error: " + err.message);

    res.statusMessage = err.statusMessage || "Something went wrong";
    return res.status(err.statusCode || 500).json({
        message: err.message,
        status: err.statusCode || 500
    })
})

async function startServer() {
    try {
        await connect2db();
        app.listen(5000, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (err) {
        console.log(err);
        logger.error(err.message)
        process.exit(1)
    }
}

startServer();