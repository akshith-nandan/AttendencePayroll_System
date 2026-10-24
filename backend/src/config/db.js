const mongoose = require('mongoose');
const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27071/attendencePayrollSystem');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    }
    catch(err){
        console.error(`MONGODB Connection Error: ${err.message}`);
        console.log('Ensure MONGODB is running locally, or configure a valid MONGODB_URI in your .env file');
        throw err;
    }
};
module.exports = connectDB;