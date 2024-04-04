const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const User = require('../models/user/user-schema');
const try_catch = require('./error-handler');
const CustomError = require('../utilities/custom-error');

exports.isLoggedIn = try_catch(async (req, res, next) => {
    const token = req.header('Authorization').replace("Bearer ", "");

    if(!token)
        return next(new CustomError('Login first to access this page!!', 401, false));
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne(
        {
            _id: decoded.id
        });
    next();
});

exports.roleRestrictions = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
            return next(new CustomError('You are not allowed to perform this action', StatusCodes.UNAUTHORIZED, false));
        next();
    }
}