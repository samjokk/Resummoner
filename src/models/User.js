const { checkPotentialUser, checkAuthUser } = require('../modules/users/main');

class User { 
    constructor(request, endpoint) {
        if(endpoint === 'auth') checkAuthUser(request);
        else checkPotentialUser(request)
        this.firstName = request.firstName;
        this.lastName = request.lastName;
        this.email = request.email;
        this.password = request.password;
        this.favorites = request.favorites;
        this.image = ''
    }
}

module.exports = { User };