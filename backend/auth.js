const jwt = require('jsonwebtoken');

function verifyToken(request, response, next) {
    const authHeaders = request.headers["authorization"];
    const token = authHeaders && authHeaders.split(' ')[1];
    if (!token) {
        return response.status(401).json({message: "Authentication token not found"});
    }        

    jwt.verify(token, process.env.SECRETKEY, (error, user) => {
        if (error) {
            return response.status(403).json({message: "Invalid token."})
        }
        request.body.user = user;
        next()
    })
}
module.exports = { verifyToken };