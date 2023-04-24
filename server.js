const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//Load env vars
dotenv.config({path: './config/config.env'})

//Connect to database
connectDB();

//Route files
const hospitals = require('./routes/hospitals')

const app = express();

//Body parser
app.use(express.json());

// Mount routers
app.use('/api/v1/hospitals', hospitals);

//เอา PORT จากไฟล์ env ถ้าลืมให้ set ที่ 5000
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //CLose server $ exit process
    server.close(() => process.exit(1));
});