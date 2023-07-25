const express= require('express')
const router= express.Router({mergeParams : true})
const catchAsync = require('../helper/catchAsync')
const expressError = require('../helper/expressError')
const Product = require('../types/products')
const Review = require('../types/review')
const reviews= require('../controllers/reviews')
const {validateReview, loggedCheck, isAuthor,  isAuthorReview}= require('../middleware')


router.post('/',loggedCheck, validateReview, catchAsync(reviews.reviewCreate))

router.delete('/:reviewId', loggedCheck, isAuthorReview, catchAsync(reviews.reviewDelete))


module.exports=router