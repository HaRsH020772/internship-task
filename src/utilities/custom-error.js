class CustomError extends Error {
    constructor(message, code, status) {
        super(message);
        this.code = code;
        this.message = message;
        this.status = status;
    }
}

module.exports = CustomError;