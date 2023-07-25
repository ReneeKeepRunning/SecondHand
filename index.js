if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express');
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const expressError = require('./helper/expressError')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const Client = require('./types/client')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')

const dogGroomingRoutes = require('./router/dogGrooming')
const reviewsRoutes = require('./router/reviews')
const clientRoutes = require('./router/client')

const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/grooming'
mongoose.connect(dbUrl)
    .then(() => {
        console.log('Mongo connected')
    })
    .catch(err => {
        console.log('oh,no mongo!')
        console.log(err)
    })
// useNewUrlParser:true,
// useCreateIndex: true,
// useUnifiedTopology: true,
// useFindAndModify: false

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

const secret = process.env.SECRET || 'this is pin'

const store = new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
    collection:"sessions"
})

store.on("error", function(e){
    console.log("session store error", e)
})

app.use(session({
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}))

app.use(flash())

app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "https: data:"],
        "script-src": ["'self'", "http: data:"]
      }
    })
  )

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(Client.authenticate()))

passport.serializeUser(Client.serializeUser());
passport.deserializeUser(Client.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.signedClient = req.user
    next()
})

app.use('/dogGrooming', dogGroomingRoutes)
app.use('/dogGrooming/:id/reviews', reviewsRoutes)
app.use('/', clientRoutes)


app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new expressError('page not found', 404))
})

// app.get('/dogGrooming/:id',(req,res,next)=>{
//     next(new expressError('id-not found', 404))
// })

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'sth went wrong!'
    res.status(statusCode).render('error', { err })
})



app.listen(3002, () => {
    console.log('listening on 3002')
})

// if(!req.body.foundproduct) throw new expressError('invalid data')



