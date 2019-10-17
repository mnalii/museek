const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event');
const favoriteRoutes = require('./routes/Favorite');
const privacyPolicy = require('./routes/privacyPolicy');
// require('dotenv').config()
const {
  cloudinaryConfig
} = require('./config/cloudinaryConfig');

const env = process.env.NODE_ENV || 'development';

/* istanbul ignore if */
if (env == 'development' || env == 'test') require('dotenv').config();

const configDb = {
  development: process.env.DBDEV,
  test: process.env.DBTEST,
  production: process.env.DBCONNECTION
};

/* istanbul ignore next */
mongoose
  .connect(configDb[env], {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));


app.use('*', cloudinaryConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
/* istanbul ignore if */
if (env !== 'test') app.use(morgan('tiny'));

/* istanbul ignore next */
app.get("/", (req, res) => {
  res.send({ hello: "world" });
});

// Router Middleware
app.use('/api/event', eventRoutes);
app.use('/api/user', userRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/privacy-policy', privacyPolicy);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port} and run on ${env}`));

module.exports = app;
