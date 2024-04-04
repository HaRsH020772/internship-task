require('dotenv').config();
const express = require('express');
const app = express();
const ErrorResponseHandler = require("./middlewares/error-response-handler");

//? Middleware configuration
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//? Bring all the required routes
const user = require('./routes/user/user-route');
const course = require('./routes/course/course-route');

//? router middleware
app.use('/api/user', user);
app.use('/api/course', course);

//? Error response handler
app.use(ErrorResponseHandler);

module.exports = app;