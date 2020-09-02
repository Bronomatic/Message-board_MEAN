require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const fWord = require('./f-word');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

const mongoUrl = process.env.DB_CONNECTION;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => {
    fWord.connected();
  })
  .catch(err => {
    console.log(err);
  });

// # Middlewares
app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images')));

// * CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
