const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

function doesExistu(testusername) {
  let temp = false;
  for (let key in users) {
    if (users[key].username === testusername) temp = true;
  }
  return temp;
}
function doesExistp(testpassword) {
  let temp = false;
  for (let key in users) {
    if (users[key].password === testpassword) temp = true;
  }
  return temp;
}
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExistu(username) && !doesExistp(password)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(400).json({ message: "error can't find" });
  }
  //return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  //  const isbnn = req.params.isbn;
  // let book = books[isbnn];
  // if (book) res.status(200).json(book);
  // res.status(404).json("Not Found Book");
  const response = await axios.get(`THE_CORRECT_URL/isbn/${req.params.isbn}`);
  return res.status(200).json(response.data);
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  //Write your code here
  const response = await axios.get(`THE_CORRECT_URL/isbn/${req.params.author}`);
  return res.status(200).json(response.data);
  //   const aur = req.params.author;
  // let book = [];
  // for (let key in books) {
  //   if (books[key].author === aur) book.push(books[key]);
  // }

  // if (book.length > 0) res.status(200).json(book);
  // res.status(404).json("Not Found Book");
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const response = await axios.get(`THE_CORRECT_URL/isbn/${req.params.title}`);
  return res.status(200).json(response.data);
  // const aur = req.params.title;
  // let book = [];
  // for (let key in books) {
  //   if (books[key].title === aur) book.push(books[key]);
  // }

  // if (book.length > 0) return res.status(200).json(book);
  // return res.status(404).json("Not Found Book");
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbnn = req.params.isbn;
  let book = books[isbnn].reviews;
  if (book) return res.status(200).json(book);
  return res.status(404).json("Not Found Book");
});

module.exports.general = public_users;
