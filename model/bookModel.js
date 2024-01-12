const joi = require('joi');

const bookSchema = joi.object({
    bookId: joi.number().required(),
    title: joi.string().required(),
    type: joi.array().items(joi.string()).required(),
    author: joi.string().required(),
    available: joi.boolean().required(),
    publishedBy: joi.number().required(), // id of publisher of the book
    currentlyHeldBy: joi.number().required(), // id of current book holder
})

module.exports = bookSchema;