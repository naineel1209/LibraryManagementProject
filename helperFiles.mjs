import { connect } from 'mongoose';

const connectDB = async () => {
    await connect('mongodb+srv://naineelsoyantar:1234567890@cluster0.uuaqzii.mongodb.net/', {
    })
    console.log("Database connected")
}

connectDB();