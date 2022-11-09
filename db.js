const mongoose = require('mongoose');
const MONGODB = process.env.MONGODB_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB);
        console.log('Connected to MONGODB.');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = {
    connectDB
}