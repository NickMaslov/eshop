const { expressjwt: jwt } = require('express-jwt');

function authJwt() {
    return jwt({
        secret: process.env.JWT_SECRET,
        algorithms: ['HS256'],
        isRevoked: isRevoked,
    }).unless({
        path: [
            { url: /\/api\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            '/api/users/login',
            '/api/users/register',
        ],
    });
}

async function isRevoked(req, payload) {
    if (!payload.isAdmin) {
        return false;
    }

    return true;
}

module.exports = authJwt;
