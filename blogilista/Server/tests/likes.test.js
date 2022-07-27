const listHelper = require("../utils/list_helper");

describe("total likes", () => {
  test("of a empty list is zero", () => {
    const blogs = [];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(0);
  });

  test("when list has only one blog equals the likes of that", () => {
    const blogs = [
      { title: "Hello", author: "Riko", url: "https://google.com", likes: 69 },
    ];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(69);
  });

  test("of a bigger list is calculated right", () => {
    const blogs = [
      { title: "Hello", author: "Riko", url: "https://google.com", likes: 69 },
      { title: "Hello2", author: "Riko", url: "https://google.com", likes: 1 },
      { title: "Hello3", author: "Riko", url: "https://google.com", likes: 5 },
    ];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(75);
  });
});
