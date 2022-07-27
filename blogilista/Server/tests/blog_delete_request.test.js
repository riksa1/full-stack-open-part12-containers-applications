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

describe("api delete tests", () => {
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

  test("blogs are removed successfully", async () => {
    await api
      .post("/api/users")
      .send({ name: "Riko", username: "rikoo", password: "password" });
    const result = await api
      .post("/login")
      .send({ username: "rikoo", password: "password" });
    const blogs = await api.get("/api/blogs");

    await api
      .delete(`/api/blogs/${blogs.body[0].id}`)
      .set("Authorization", `bearer ${result.body.token}`)
      .expect(204);
  });

  test("there are two blogs after removing  one", async () => {
    await api
      .post("/api/users")
      .send({ name: "Riko", username: "rikoo", password: "password" });
    const result = await api
      .post("/login")
      .send({ username: "rikoo", password: "password" });
    const blogs = await api.get("/api/blogs");
    await api
      .delete(`/api/blogs/${blogs.body[0].id}`)
      .set("Authorization", `bearer ${result.body.token}`);

    const blogs2 = await api.get("/api/blogs");

    expect(blogs2.body).toHaveLength(initialBlogs.length - 1);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
