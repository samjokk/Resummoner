class UserException {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = 400;
    }
}

module.exports = { UserException }