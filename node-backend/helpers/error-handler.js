function errorHandler(err, req, res, next) {
    console.log({ error: err.message });

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).send({ message: 'The user is not authorized' });
    }

    if (err.name === 'ValidationError') {
        //  validation error
        return res.status(401).send({ message: err });
    }
    if (err.name === 'CastError') {
        //  validation error
        return res.status(401).send({
            message: 'Cast to ObjectId failed. Should be 12 characters string.',
        });
    }
    // MongooseError:

    // default to 500 server error
    return res.status(500).send({ error: err.message, err });
}

module.exports = errorHandler;
