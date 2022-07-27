const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  var likes = blogs.reduce((prev, curr) => prev + curr.likes, 0);
  return likes;
};

const favoriteBlog = (blogs) => {
  if (blogs.length > 0) {
    const favorite = blogs.reduce((prev, curr) =>
      prev.likes > curr.likes ? prev : curr
    );
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes,
    };
  } else {
    return {};
  }
};

const mostBlogs = (blogs) => {
  if (blogs.length > 0) {
    const result = blogs.reduce((prev, curr) => {
      prev[curr.author] = prev[curr.author] ? prev[curr.author] + 1 : 1;

      return prev;
    }, {});
    const name = Object.keys(result).reduce((prev, curr) =>
      result[prev] > result[curr] ? prev : curr
    );
    const mostLikes = blogs.reduce((prev, curr) =>
      prev.likes > curr.likes ? prev : curr.name === name ? curr : prev
    );
    return { author: mostLikes.author, likes: mostLikes.likes };
  } else {
    return {};
  }
};

const mostLikes = (blogs) => {
  if (blogs.length > 0) {
    const result = blogs.reduce((prev, curr) => {
      prev[curr.author]
        ? (prev[curr.author] = prev[curr.author] + curr.likes)
        : (prev[curr.author] = curr.likes);

      return prev;
    }, {});
    const maxKey = _.maxBy(_.keys(result), function (o) {
      return result[o];
    });
    return { author: maxKey, likes: result[maxKey] };
  } else {
    return {};
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
