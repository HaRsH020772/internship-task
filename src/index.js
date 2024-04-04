require('dotenv').config();
const app = require('./app');
const connectWithDb = require('./config/db-config');
const cloudinary = require('cloudinary').v2;
const http = require("http").Server(app);

(async function init() {

    //& Connection with the database
    connectWithDb();

    //& Cloudinary Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    //& Server Configuration
    http.listen(process.env.PORT, () => {
        console.log(`PORT is running at ${process.env.PORT}`);
    });
})();