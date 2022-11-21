// -- SimpleWebapp
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`Hello there stranger! weird times to life in.`);
})

// -- PORT
app.listen(8080, () => {
  console.log('Listening on :8080')
})