const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient();


//init number of visits to 0
client.set('visits', 0);

app.get('/', (req, res) => {
  client.get('client', (err, visits) => {
    if (err) console.log(err);
    res.send(`Hello Vistor, thou are guest ${visits}`);
    client.set('visits', parseInt(visits) + 1);
  })
});

app.listen(8080, () => {
  console.log('Listening on Port :8080')
});
