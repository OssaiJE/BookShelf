const path = require('path');
const express = require('express');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const mongoStore = require("connect-mongo")(session);
const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/config.env'});

// Passport config
require("./config/passport")(passport);

// Connecting to DB
connectDB();

const app = express();

// Body-Parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Handlebars Helpers
const {formatDate} = require("./helpers/hbs");

// Handle-bars extension and the layout
app.engine('.hbs', exphbs({helpers: {formatDate}, defaultLayout: "main", extname: '.hbs'}));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({mongooseConnection: mongoose.connection})
  }));
  
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 1999;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));