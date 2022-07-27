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

describe("api post tests", () => {
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

  test("blogs are added successfully", async () => {
    await api
      .post("/api/users")
      .send({ name: "Riko", username: "rikoo", password: "password" });
    const result = await api
      .post("/login")
      .send({ username: "rikoo", password: "password" });
    await api
      .post("/api/blogs")
      .send({
        title: "Joku title",
        author: "Riko Saarinen",
        url: "https://google.com",
        likes: 21,
      })
      .set("Authorization", `bearer ${result.body.token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("there are four blogs after adding a new one", async () => {
    const newBlog = {
      title: "Joku title",
      author: "Riko Saarinen",
      url: "https://google.com",
      likes: 21,
    };
    await api
      .post("/api/users")
      .send({ name: "Riko", username: "rikoo", password: "password" });
    const result = await api
      .post("/login")
      .send({ username: "rikoo", password: "password" });
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `bearer ${result.body.token}`);
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(response.body[3]).toMatchObject({
      title: "Joku title",
      author: "Riko Saarinen",
      url: "https://google.com",
      likes: 21,
    });
  });

  test("when likes are not added they are automatically 0", async () => {
    await api
      .post("/api/users")
      .send({ name: "Riko", username: "rikoo", password: "password" });
    const result = await api
      .post("/login")
      .send({ username: "rikoo", password: "password" });
    await api
      .post("/api/blogs")
      .send({
        title: "Joku title",
        author: "Riko Saarinen",
        url: "https://google.com",
      })
      .set("Authorization", `bearer ${result.body.token}`)
      .expect(201);

    const response = await api.get("/api/blogs");

    expect(response.body[3]).toMatchObject({ likes: 0 });
  });

  test("when url and title are not added 400 status code is returned", async () => {
    await api
      .post("/api/users")
      .send({ name: "Riko", username: "rikoo", password: "password" });
    const result = await api
      .post("/login")
      .send({ username: "rikoo", password: "password" });
    await api
      .post("/api/blogs")
      .send({
        author: "Riko Saarinen",
        likes: 30,
      })
      .set("Authorization", `bearer ${result.body.token}`)
      .expect(400);
  });

  test("If there is no token return 401 unathorized", async () => {
    await api
      .post("/api/blogs")
      .send({
        author: "Riko Saarinen",
        likes: 30,
      })
      .expect(401);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
