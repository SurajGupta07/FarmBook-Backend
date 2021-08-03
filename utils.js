const jwt = require('jsonwebtoken');
const mySecret = "FDn15Q6Zqs3vcpznfJwJkDFPKz4J1bIPmwHhDDIHpwivpYT1UL7323tlyznywBRupPvj8h28feSWHSCbuCq3inwKH0sRUUSOXZOTvGiWqX3MiOzeGGEneNXlAWUtPjooIg556kw3RkVYXPvMIHHSACLqQSI6E4NEdSxOh9aP7o7AShGrth9+KDA7iJYC/77vCbtKM+21vV7jxwFJmEisLpemV6sNlVkdTLBJBcc2aGT+SuJaHfNA8JHtvf0KiC/zn8UgW6prR79UA6cKl8DbAwsIJMOaNYJYnMIBRUc4YnsW7nyu8WiHd5U31OY2K+/Mlr4tDw0I4j0nB+Jx+rPyxA=="

//Handle Errors

const handleErrors = (err) => {
    let errors = {
        email: '',
        password: ''
    }

    if (err.code === 11000) {
        errors.email = 'Email already exists'
        return errors;
    }

    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({
            properties
        }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const catchError = async (next, callback) => {
    try {
        await callback();
    } catch (err) {
        next(err);
    }
}

const createToken = (id) => {
    return jwt.sign({
        id
    }, mySecret, {
        expiresIn: "24h"
    })
}

module.exports = {
    handleErrors,
    createToken
};