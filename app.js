if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");
const ejsmate = require("ejs-mate");
const session = require("express-session")
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport  = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user")
const mongoSanitize = require("express-mongo-sanitize")

const userroutes = require("./routes/users")
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

const MongoStore = require("connect-mongo")(session);
const db_url = process.env.DB_URL;

mongoose
  .connect(
    db_url
  )
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const store = new MongoStore({
  url : db_url,
  secret : "thisshouldbeabettersecret",
  touchAfter : 24 * 60 * 60,
})

store.on("error" , function(e) {
  console.log("session store error" , e)
})

const sessionConfig = {
  store , 
  name : "session" ,
  secret : "thisshouldbeabettersecret",
  resave : false,
  saveUninitialized : true,
  cookie : {
    httpOnly : true ,
    // secure : true ,
    expires : Date.now() + 1000 *60 *60 *24 * 7,
    maxAge : 1000*60*60*24*7,
  }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(mongoSanitize({}))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next ) =>  {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

// app.get("/fakeUser"  , async(req , res) => {
//   const user = new User({email : "amittt@gmail.com"  , username : "amitSharma"})
//   const newuser = await User.register(user , "amit");
//   res.send(newuser);
// })

app.use("/" , userroutes)
app.use("/campgrounds"  , campgrounds)
app.use("/campgrounds"  , reviews)

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh no , Something Went wrong!";
  res.status(status).render("error.ejs", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
