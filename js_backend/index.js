const express = require('express');
const app = express();
const port = 3000;

var count = 0
app.get('/', (req, res) => {
  res.send({count: count});
});

app.get('/inc', (req, res) => {
    count +=1
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});