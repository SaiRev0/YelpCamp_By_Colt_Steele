const express = require("express")
const router = express.Router()
const campgrounds = require("../controllers/campgrounds")
const catchAsync = require("../utils/catchAsync.js");
const {isloggedin , validateCampground, isAuthor} = require("../middleware");
const multer = require("multer");
const {storage } = require("../cloudinary/index")
const upload = multer({ storage})


router.route("/")
.get(catchAsync(campgrounds.index))
.post(
  isloggedin ,  
  upload.array("image"),
  validateCampground,
  catchAsync(campgrounds.createCampground)
);
  
router.get("/new", isloggedin , campgrounds.renderNewForm);
  
router.route("/:id")
.get(
catchAsync(campgrounds.showCampground)
  )
.put(
  isloggedin,
  isAuthor ,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.UpdateCampground)
  )
.delete(
    (isloggedin ,isAuthor , catchAsync(campgrounds.DeleteCampground))
  );

  router.get("/:id/edit", isloggedin , isAuthor , catchAsync(campgrounds.renderEditForm));
   module.exports = router;