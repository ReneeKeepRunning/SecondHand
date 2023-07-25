const { ProductJoiSchemas, ReviewJoiSchema} = require('./JoiSchemas.js')
const expressError = require('./helper/expressError')
const Product = require('./types/products')
const Review = require('./types/review')





module.exports.loggedCheck= (req, res, next)=>{
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash('error', 'Please login first')
        req.session.returnUrl= req.originalUrl
        console.log( req.session.returnUrl)
        res.redirect('/login')
    }
}

module.exports.validateProduct = (req, res, next) => {
    const result = ProductJoiSchemas.validate(req.body)
    if (result.error) {
        const message = result.error.details.map(el => el.message).join(',')
        throw new expressError(message, 400)
    } else {
        next()
    }
}

module.exports.isAuthor= async(req, res, next)=> {
    const {id}= req.params
    const found= await Product.findById(id)
    if(!found.author[0].equals(req.user._id)){
        req.flash('error', 'Sorry, you do not have permission')
        return res.redirect(`/dogGrooming/${id}`)
    }
    next()
}

module.exports.isAuthorReview= async(req, res, next)=> {
    const reviewId= req.params.reviewId
    const id= req.params.id
    const review= await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'Sorry, you do not have permission')
        return res.redirect(`/dogGrooming/${id}`)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const result = ReviewJoiSchema.validate(req.body)
    if (result.error) {
        const message = result.error.details.map(el => el.message).join(',')
        throw new expressError(message, 400)
    } else {
        next()
    }
}