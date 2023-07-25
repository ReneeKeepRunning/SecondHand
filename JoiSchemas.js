const BaseJoi = require('Joi')
const sanitizeHtml= require('sanitize-html')
//const { validateProduct } = require('./middleware')

const extension= (joi) =>({
    type:'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules:{
        escapeHTML:{
            validate(value, helpers){
                const clean = sanitizeHtml(value,{
                    allowedTag:[],
                    allowedAttributes:{},
                })
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean
            }
        }
    }
})
const Joi = BaseJoi.extend(extension)

module.exports.ProductJoiSchemas = Joi.object({
    product:Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().required(),
        category: Joi.required(),
        deleteImages: Joi.array()
})
})
// if(!req.body) throw new expressError('Invalid data', 400)

module.exports.ReviewJoiSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required()
    }).required()
})
