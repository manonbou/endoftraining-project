const Validator = require('validator')


module.exports = function (data) {
    let error = {}

    if(!Validator.isEmail(data.email)) {
        error.email = 'Email field must be an email !'
    }

    if(Validator.isEmpty(data.email)) {
        error.email = 'Email is required!'
    }

    if(Validator.isEmpty(data.login)) {
        error.login = 'Login is required!'
    }

    if(!Validator.isLength(data.login, { min:6, max:30})) {
        error.login = 'Login must be between 6 and 30 characters'
    }
3
    if(!Validator.isLength(data.password, { min:6, max:30})) {
        error.password = 'Password must be between 6 and 30 characters'
    }

    if(Validator.isEmpty(data.password)) {
        error.password = 'Password is required'
    }

    if (Validator.isEmpty(data.password2)) {
        error.password2= 'Confirm password is required'
    }

    if(!Validator.equals(data.password, data.password2)) {
        error.password2 = 'Passwords must match !'
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}