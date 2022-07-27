const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const User = require("../models/user");

const initialUsers = [
  {
    name: "Riko",
    username: "Riko Saarinen",
    password: "Salasana",
  },
  {
    name: "Riko2",
    username: "Riko Saarinen2",
    password: "Salasana2",
  },
  {
    name: "Riko3",
    username: "Riko Saarinen3",
    password: "Salasana3",
  },
];

describe("api user registering tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    for (var i = 0; i < initialUsers.length; i++) {
      await api.post("/api/users").send(initialUsers[i]);
    }
  });

  test("test that user test with fails with too small username and password and if username is not unique", async () => {
    await api
      .post("/api/users")
      .send({
        name: "Ri",
        username: "Ri",
        password: "jee",
      })
      .expect(400);
    await api
      .post("/api/users")
      .send({
        name: "Rikoo",
        username: "Riko saarinen5",
        password: "je",
      })
      .expect(400);
    await api
      .post("/api/users")
      .send({
        name: "Riko",
        username: "Riko Saarinen",
        password: "jee",
      })
      .expect(400);

    const users = await api.get("/api/users");
    expect(users.body.length).toBe(3);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
