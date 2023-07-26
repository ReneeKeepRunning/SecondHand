const mongoose = require('mongoose');
const { ReviewJoiSchema } = require('../joiSchemas');
const Review = require('./review')
const Client = require('./client')

const imageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 0
    },
    petCategory: {
        type: String,
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    condition: {
        type: String
    },
    image: [imageSchema],
    location: {
        type: String
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client'
        }],
    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }]
})

productSchema.post('findOneAndDelete', async (product) => {
    const list = product.review
    for (let r of list) {
        //const id= r.valueOf()
        //const reviewDelete= await Review.findByIdAndDelete(reviewId)
        const review = await Review.remove(r)
        console.log(review)
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
