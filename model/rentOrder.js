const { Schema, model, Types } = require('mongoose');

const rentOrderSchema = new Schema({
    bookId: {
        type: Types.ObjectId,
        required: [true, "BookId is required"],
        ref: "Book",
    },
    rentedBy: {
        type: Types.ObjectId,
        required: [true, "RentedBy is required"],
        ref: "User",
    },
    rentDate: {
        type: Date,
        default: Date.now,
        required: [true, "Rent date is required"],
    },
    returnDate: {
        type: Date,
        required: [true, "Return date is required"],
    },
    returned: {
        type: Boolean,
        default: false,
    },
    lost: {
        type: Boolean,
        default: false,
    },
    payment: {
        type: Number,
    },
    penalty: {
        type: Number,
    },
    totalPayment: {
        type: Number,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = model('RentOrder', rentOrderSchema);