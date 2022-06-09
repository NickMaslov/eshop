require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
// const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());
// app.use(authJwt());

app.use(morgan('tiny'));

const rootRouter = require('./routes');

app.use('/api', rootRouter);
app.use(errorHandler);
app.use('*', (req, res) =>
    res.status(404).send("Wrong API route! Route doesn't exist!")
);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => console.log('Server is running!'));
    })
    .catch((e) => console.log(e));
