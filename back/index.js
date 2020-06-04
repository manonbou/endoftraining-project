const express = require ('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const users = require ('./routes/users')
const activity = require('./routes/activity')
const cors = require('cors')
const passport = require('passport')
const HttpError = require('./models/Http-error')
// setup environment
dotenv.config()

//mongo DB connect

mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true,  useUnifiedTopology: true } )


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())

app.use(passport.initialize())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

require('./config/passport')(passport)
app.use('/api/users', users)
app.use('/api/activity', activity)

//----- Errors managing Middleware -----//

//--Managing wrong routes
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
})

//--Managing all errors
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An error occurred.'})
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
