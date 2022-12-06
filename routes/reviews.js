const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/catchAsync.js");
const reviews = require("../controllers/reviews")
const {validateReview , isloggedin , isReviewAuthor} = require("../middleware")

router.post(
    "/:id/reviews",
    isloggedin ,
    validateReview,
    catchAsync(reviews.CreateReview)
  );
  
router.delete("/:id/reviews/:reviewId" , isReviewAuthor , isloggedin ,catchAsync(reviews.DeleteReview))

  module.exports = router;