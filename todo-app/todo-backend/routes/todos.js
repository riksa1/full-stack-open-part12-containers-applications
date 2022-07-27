const express = require('express');
const { Todo } = require('../mongo');
const redis = require('../redis');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  var counter = await redis.getAsync('counter')
  if (counter && !isNaN(counter)) {
    counter = parseInt(counter)
    counter++
  } else {
    counter = 1
  }
  await redis.setAsync('counter', counter)
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body
  if (text === undefined) return res.sendStatus(400)
  if (done === undefined) return res.sendStatus(400)
  await req.todo.update({ text, done })
  res.send({ _id: req.todo._id, text, done });
});

router.use('/:id', findByIdMiddleware, singleRouter)

module.exports = router;
