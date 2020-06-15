const express = require('express');
const bodyParser = require('body-parser');
const dummy = require('./dummy.json');

const port = 3333;

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(bodyParser.json());

app.get('/api/get', (req, res) => {
  console.log('🍕'.repeat(20));
  console.log(dummy);
  res.status(200).json(dummy);
})

app.listen(port, () => console.log(`listening on port ${port}`));
