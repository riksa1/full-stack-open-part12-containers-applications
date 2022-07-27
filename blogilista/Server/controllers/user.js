const userRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

userRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({}).populate("blogs", "-likes -user");
    response.json(users);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return response.status(400).json({
        error: "username must be unique",
      });
    } else if (password.length < 3 || password === undefined) {
      return response.status(400).json({
        error: "password must be minimum 3 characters long",
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
