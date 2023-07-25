const Product = require('../types/products')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken= process.env.MAPBOX_TOKEN
const geocoder= mbxGeocoding({accessToken:mapboxToken})

const categories = ['dental', 'health', 'shower', 'other'];


module.exports.index= async (req, res) => {
    const foundproduct = await Product.find({})
    res.render('products/index', { foundproduct })
}

module.exports.newForm= (req, res) => {
    res.render('products/new', { categories })
}

module.exports.newFormPost= async (req, res, next) => {
    const geoData= await geocoder.forwardGeocode({
        query:req.body.product.location,
        limit: 1
    }).send()
    const newProduct = new Product(req.body.product);
    newProduct.geometry= geoData.body.features[0].geometry
    newProduct.image= req.files.map(f =>({url: f.path, filename: f.filename}))
    newProduct.author= req.user._id
    await newProduct.save()
    console.log(newProduct)
    req.flash('success', 'You are successfully made a new product.')
    res.redirect(`/dogGrooming/${newProduct._id}`)
}

module.exports.showById= async (req, res) => {
    const { id } = req.params;
    const foundproduct = await Product.findById(id).populate({
        path: 'review',
        populate:{
            path: 'author'
    }
    }).populate('author')
    if(!foundproduct){
        req.flash('error', 'Oh no, cannot find that product!')
        return res.redirect('/dogGrooming')
    }
    res.render('products/show', { foundproduct })
}

module.exports.editForm= async (req, res) => {
    const foundproduct = await Product.findById(req.params.id)
    if(!foundproduct){
        req.flash('error', 'Oh no, cannot find that product!')
        return res.redirect('/dogGrooming')
    }
    res.render('products/edit', { foundproduct, categories })
}

module.exports.editFormPost= async (req, res) => {
    const { id } = req.params;
    const foundProduct = await Product.findByIdAndUpdate(id, {...req.body.product}, { new: true, runValidators: true });
    const imgs=req.files.map(f =>({url: f.path, filename: f.filename}))
    foundProduct.image.push(...imgs)
    await foundProduct.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await foundProduct.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}})
    }
    console.log(foundProduct)
    req.flash('success', 'Successfully updated a product!');
    res.redirect(`/dogGrooming/${foundProduct._id}`);
  }

module.exports.productDelete= async (req, res) => {
    const { id } = req.params
    const foundproduct = await Product.findByIdAndDelete(id)
    req.flash('success', 'You have successfully delete it.')
    res.redirect('/dogGrooming')
}