const basejoi = require('joi')
const sanitizeHtml = require('sanitize-html')
//const { validateProduct } = require('./middleware')
jJ
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTag: [],
                    allowedAttributes: {},
                })
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean
            }
        }
    }
})
const joi = basejoi.extend(extension)

module.exports.ProductJoiSchemas = joi.object({
    product: joi.object({
        name: joi.string().required(),
        price: joi.number().required().min(0),
        description: joi.string().required(),
        location: joi.string().required(),
        image: joi.string().required(),
        category: joi.required(),
        deleteImages: joi.array()
    })
})
// if(!req.body) throw new expressError('Invalid data', 400)

module.exports.ReviewJoiSchema = joi.object({
    review: joi.object({
        body: joi.string().required(),
        rating: joi.number().required()
    }).required()
})
