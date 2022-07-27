const express = require('express');
const redis = require('../redis')
const router = express.Router();

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (req, res) => {
  var counter = await redis.getAsync('counter')
  if (!counter || isNaN(counter)) {
    counter = 0
  } else {
    counter = parseInt(counter)
  }
  res.json({ added_todos: counter });
})

module.exports = router;
