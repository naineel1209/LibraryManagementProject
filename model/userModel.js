const joi = require('joi');

const userSchema = joi.object({
    //put by the user
    username: joi.string().alphanum().min(3).max(30).required(),
    password: joi.string().required(),
    email: joi.string().email().required(),

    //put by the server
    role: joi.string().required(),
    token: joi.string(),
    _id: joi.number().required(),
})

module.exports = userSchema;