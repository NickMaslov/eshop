require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
app.use(express.json());

app.use(cors());
app.options('*', cors());

app.use(morgan('tiny'));

const rootRouter = require('./routes');

app.use('/api', rootRouter);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => console.log('Server is running!'));
    })
    .catch((e) => console.log(e));
