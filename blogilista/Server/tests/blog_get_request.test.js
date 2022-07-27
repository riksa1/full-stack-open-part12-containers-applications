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

describe("api get tests", () => {
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

  test("blogs are returned as json and have all values", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are three blogs", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test("the first blogs author is Riko Saarinen", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].author).toBe("Riko Saarinen");
  });

  test("the blogs have a id field instead of _id", async () => {
    const response = await api.get("/api/blogs");

    const ids = response.body.map((b) => b.id);

    expect(ids).toBeDefined();
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
