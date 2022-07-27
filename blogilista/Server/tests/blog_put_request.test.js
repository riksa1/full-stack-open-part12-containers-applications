const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

const api = supertest(app);

const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Blog0",
    author: "Riko Saarinen",
    url: "https://google.com",
    likes: 68,
  },
  {
    title: "Blog1",
    author: "Riko Saarinen2",
    url: "https://google.com",
    likes: 22,
  },
  {
    title: "Blog2",
    author: "Riko Saarinen3",
    url: "https://google.com",
    likes: 100,
  },
];

describe("api put tests", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await api
      .post("/api/users")
      .send({ name: "Riko", username: "rikoo", password: "password" });
    const result = await api
      .post("/login")
      .send({ username: "rikoo", password: "password" });
    const decodedToken = jwt.verify(result.body.token, process.env.SECRET);
    for (var i = 0; i < initialBlogs.length; i++) {
      initialBlogs[i].user = decodedToken.id;
    }
    await Blog.insertMany(initialBlogs);
  });

  test("blog is updated successfully and return right object", async () => {
    const result = await api.get("/api/blogs");
    const result2 = await api
      .post("/login")
      .send({ username: "rikoo", password: "password" });
    let decodedToken = jwt.verify(result2.body.token, process.env.SECRET);
    const updatedBlog = await api
      .put(`/api/blogs/${result.body[0].id}`)
      .send({
        title: "Blog4",
        author: "Riko Saarinen4",
        url: "https://google.com",
        likes: 999,
        user: result.body[0].user.id,
      })
      .set("Authorization", `bearer ${result2.body.token}`)
      .expect(203);
    expect(updatedBlog.body).toMatchObject({
      title: "Blog4",
      author: "Riko Saarinen4",
      url: "https://google.com",
      likes: 999,
      user: {
        blogs: [],
        id: decodedToken.id,
        name: "Riko",
        username: "rikoo",
      },
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
