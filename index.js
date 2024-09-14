const express = require("express");
const app = express()
const connectDatabase = require('./Database');
const ErrorMiddleware = require("./Middlewares/Error.Middleware.js");
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
connectDatabase()
    .catch(error => console.log(error.message))
// app.get('/', (req, res) => {
//     res.send("hii")
// })
const router = require('./Routes/User.routes.js');
app.use('/api/v1/user', router)
app.use(ErrorMiddleware)

app.listen(4000, () => {
    console.log('Listening on 4000');
})