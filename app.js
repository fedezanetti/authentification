//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const passport = require("passport");
const encrypt = require("mongoose-encryption");

const secret = process.env.SECRET;

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: secret, encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');


app.get("/", function(req,res){
  res.render("home")
});

app.post("/register", function(req, res){
  const userName = req.body.username;
  const password = req.body.password;
  const newUser = new User({
    email: userName,
    password: password
  });
  async function save(){
    try{
      await newUser.save();
      res.render("secrets");
    } catch(err){
      console.log(err);
    }}
  save();
  

});

app.get("/login", function(req,res){
  res.render("login")
});

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  async function find(){
    try{
      const foundUser = await User.findOne({email: username});
      if (foundUser.password === password){
        res.render("secrets");
      } else {
        console.log("password incorrect");
        res.render("error");
      }
    } catch(err){
      console.log(err);
      res.render("error");
    }}
  find();
  
  
});


app.get("/register", function(req,res){
  res.render("register")

});



app.listen(3000, function() { 
    console.log("Server started on port 3000");
  });