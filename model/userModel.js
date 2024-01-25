const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt')
require('dotenv').config();

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username already exists"],
        minlength: 3,
        maxlength: 30,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email"],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    token: {
        type: String,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();

    bcrypt.hash(this.password, Number(process.env.SALT), (err, hashedPass) => {
        if (err) return next(err);

        this.password = hashedPass;
        next();
    })
})

module.exports = model('User', userSchema);