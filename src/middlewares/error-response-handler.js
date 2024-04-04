const ErrorResponseHandler = (error, req, res, next) => {

    return res.status(error.code > 511 ? 500 : error.code).json({
        message: error.message || "Internal server error",
        status: error.status || false
    })
}

module.exports = ErrorResponseHandler;