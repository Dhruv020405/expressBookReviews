const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!isValid(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists"});
    }
  }
  return res.status(404).json({message: "Unable to register user"});
});

// Get all books
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', async (req,res)=>{
  try{
    const response = await axios.get('http://localhost:5000/');
    const book = response.data[req.params.isbn];

    if(book){
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message:"Book not found"});
    }
  } catch(err){
    return res.status(500).json({message:"Error fetching data"});
  }
});
// Get books by author
public_users.get('/author/:author', async (req,res)=>{
  try{
    const response = await axios.get('http://localhost:5000/');
    const books = Object.values(response.data).filter(
      b => b.author === req.params.author
    );

    if(books.length > 0){
      return res.status(200).json(books);
    } else {
      return res.status(404).json({message:"No books found"});
    }
  } catch(err){
    return res.status(500).json({message:"Error fetching data"});
  }
});

// Get books by title
public_users.get('/title/:title', async (req,res)=>{
  try{
    const response = await axios.get('http://localhost:5000/');
    const books = Object.values(response.data).filter(
      b => b.title === req.params.title
    );

    if(books.length > 0){
      return res.status(200).json(books);
    } else {
      return res.status(404).json({message:"No books found"});
    }
  } catch(err){
    return res.status(500).json({message:"Error fetching data"});
  }
});

// Get reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
