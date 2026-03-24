const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// check if username already exists
const isValid = (username)=>{ 
  return users.some(user => user.username === username);
}

// check username + password match
const authenticatedUser = (username,password)=>{ 
  return users.some(user => user.username === username && user.password === password);
}

// login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;

  if(!username || !password){
    return res.status(404).json({message: "Error logging in"});
  }

  if(authenticatedUser(username, password)){
    let token = jwt.sign({data: username}, "access", {expiresIn: "1h"});
    return res.status(200).json({message: "Login successful", token: token});
  } else {
    return res.status(404).json({message: "Invalid Login. Check username and password"});
  }
});

// Add / Modify review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.body.username;
  const review = req.body.review;
  const isbn = req.params.isbn;

  if(books[isbn]){
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
