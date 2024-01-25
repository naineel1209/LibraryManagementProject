// const joi = require('joi');

// const bookSchema = joi.object({
//     bookId: joi.number().required(),
//     title: joi.string().required(),
//     type: joi.array().items(joi.string()).required(),
//     author: joi.string().required(),
//     available: joi.boolean().required(),
//     publishedBy: joi.number().required(), // id of publisher of the book
//     currentlyHeldBy: joi.number().required(), // id of current book holder
// })

const { Schema, model, Types } = require('mongoose');

const bookSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    type: {
        type: [String],
        required: [true, "Type is required"],
    },
    author: {
        type: String,
        required: [true, "Author is required"],
    },
    available: {
        type: Boolean,
        default: true,
    },
    publishedBy: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, "Publisher is required"],
    },
    currentlyHeldBy: {
        type: Types.ObjectId,
        default: null,
        ref: "User",
    },
    lost: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

module.exports = model('Book', bookSchema);