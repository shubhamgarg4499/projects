const express = require("express");
const app = express()
const connectDatabase = require('./Database');
const ErrorMiddleware = require("./Middlewares/Error.Middleware.js");
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
require("dotenv").config()
require("dotenv").config()
const PORT =process.env.PORT
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
connectDatabase()
    .catch(error => console.log(error.message))
app.get('/', (req, res) => {
    res.send("hii")
})
const router = require('./Routes/User.routes.js');
app.use('/api/v1/user', router)
app.use(ErrorMiddleware)

app.listen(PORT, () => {
    console.log('Listening on'+PORT);
})
