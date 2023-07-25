const Product = require('../types/products')
const Review = require('../types/review')

module.exports.reviewCreate = async (req, res) => {
    const foundproduct = await Product.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    foundproduct.review.push(review)
    await review.save()
    await foundproduct.save()
    req.flash('success', 'Check it out, You created a new review in this item!')
    res.redirect(`/dogGrooming/${foundproduct._id}`)
}

module.exports.reviewDelete = async(req,res)=>{
    const reviewId= req.params.reviewId
    const id= req.params.id
    const reviewDelete= await Review.findByIdAndDelete(reviewId)
    const productUpdate= await Product.findByIdAndUpdate(id, {$pull:{review: reviewId}})
    req.flash('success', 'You have successfully delete it.')
    res.redirect(`/dogGrooming/${id}`)
}