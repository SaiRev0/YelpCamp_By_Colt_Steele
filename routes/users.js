const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const passport = require("passport")
const users = require("../controllers/users")

router.route("/register")
.get( users.renderRegister)
.post( catchAsync(users.CreateUser))

router.route("/login")
.get( users.renderLogin)
.post( passport.authenticate("local" ,{failureFlash : true , failureRedirect : "/login"} ) , users.authenticateUser)

router.get("/logout" , users.logoutUser)

module.exports = router;