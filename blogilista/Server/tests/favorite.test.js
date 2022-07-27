const listHelper = require("../utils/list_helper");

describe("blog with the most likes", () => {
  test("of a empty list is empty", () => {
    const blogs = [];

    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({});
  });

  test("when list has only one blog get that one as favorite", () => {
    const blogs = [
      { title: "Hello", author: "Riko", url: "https://google.com", likes: 69 },
    ];

    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({ title: "Hello", author: "Riko", likes: 69 });
  });

  test("of a bigger list is found the right answer", () => {
    const blogs = [
      { title: "Hello", author: "Riko", url: "https://google.com", likes: 22 },
      { title: "Hello2", author: "Riko", url: "https://google.com", likes: 5 },
      { title: "Hello3", author: "Riko", url: "https://google.com", likes: 21 },
    ];

    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({ title: "Hello", author: "Riko", likes: 22 });
  });

  test("of a bigger list with two top values the same likes", () => {
    const blogs = [
      { title: "Hello", author: "Riko", url: "https://google.com", likes: 22 },
      { title: "Hello2", author: "Riko", url: "https://google.com", likes: 5 },
      { title: "Hello3", author: "Riko", url: "https://google.com", likes: 22 },
    ];

    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({
      title: "Hello3",
      author: "Riko",
      likes: 22,
    });
  });
});
