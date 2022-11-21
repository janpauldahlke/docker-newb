const express = require('express');
const redis = require('redis');
const _VISITS =  'visits'

const app = express();
const client = redis.createClient({
  //host: 'https://myAdress.com' // not in docker
  host: 'redis-server', // the name needs to be similar to the name in the docker-compose.yml naming
  port: 6379 // default redis port
});
//init number of visits to 0
client.set(_VISITS, 0);

app.get('/', (req, res) => {
  client.get(_VISITS, (err, visits) => {
    if (err) console.log(err);
    res.send(`Hello Vistor, thou are guest ${visits}`);
    client.set(_VISITS, parseInt(visits) + 1);
  })
});

app.listen(8080, () => {
  console.log('Listening on Port :8080')
});
