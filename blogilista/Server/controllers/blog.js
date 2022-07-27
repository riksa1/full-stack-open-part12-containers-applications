const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const { userExtractor } = require("../utils/middleware");

blogRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", "-blogs");
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.post("/", userExtractor, async (request, response, next) => {
  const { author, title, url, likes } = request.body;
  try {
    const user = request.user;
    const blog = new Blog({
      author: author,
      title: title,
      url: url,
      likes: likes,
      user: user.id,
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    savedBlog.populate("user", function (err) {
      response.status(201).json(savedBlog);
    });
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:id", userExtractor, async (request, response, next) => {
  const { id } = request.params;
  const { author, title, url, likes } = request.body;

  try {
    const updatedObject = await Blog.findByIdAndUpdate(
      id,
      {
        author: author,
        title: title,
        likes: likes,
        url: url,
      },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    updatedObject.populate("user", function (err) {
      response.status(203).json(updatedObject);
    });
  } catch (error) {
    next(error);
  }
});

blogRouter.delete("/:id", userExtractor, async (request, response, next) => {
  const { id } = request.params;
  try {
    const user = request.user;
    const blog = await Blog.findById(id);
    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(id);
      response.status(204).json({ message: "Deleted" });
    } else {
      return response
        .status(401)
        .json({ error: "you dont have the rights to remove this blog" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = blogRouter;
