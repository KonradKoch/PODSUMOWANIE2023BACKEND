const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();
const fs = require('fs');
const logger = require('morgan')


// app
const app = express();

// db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
}).then(() => console.log('db connected!')).catch((error) => console.log(`db connection error: ${error}`))

// middlewares
app.use(logger('dev'));
app.use(bodyParser.json({ limit: "10mb"}));
app.use(cors());

// routes middleware
fs.readdirSync('./routes').map((route => app.use('/api', require('./routes/' + route))));

//images
app.use('/images', express.static('images'));

// test
app.get('/api', (request, response) => {
  response.json({
      data: 'u hit node API!'
  });
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));


module.exports = app;
