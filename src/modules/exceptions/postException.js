class PostException {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = 400;
    }
}

module.exports = { PostException }