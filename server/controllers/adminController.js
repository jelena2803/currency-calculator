require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const key = process.env.ADMIN_SECRET_KEY;

// admin signup
const signup = async (req, res) => {
  try {
    // request body handler
    const { username, password, email, securityKey } = req.body;
    //   verify that all the required fields are not empty
    if (!username || !password || !email || !securityKey) {
      return res
        .status(400)
        .json({ msg: "Please complete all the required fields" });
    }

    // verify the security key
    if (securityKey != key) {
      return res.status(400).json({ msg: "Security key is incorrect" });
    }

    // in case the security key is valid, check if the admin username and email can be found in the db
    const adminUsernameFound = await Admin.findOne({ username });
    // return error message if there is already registered admin with the same username
    if (adminUsernameFound) {
      return res
        .status(400)
        .send({ msg: "Admin with the same username already exists" });
    }
    // return error if there is already registered admin with the same email
    const adminEmailFound = await Admin.findOne({ email });
    if (adminEmailFound) {
      return res
        .status(400)
        .json({ msg: "Admin with the same email already exists" });
    }

    // accept only password with minimum 6 characters
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password should have minimum 6 characters" });
    }
    //Hash the entered password
    const hashedPassword = bcrypt.hashSync(password, 10);
    //Create an admin with the data sent and sending the response data
    const newAdmin = await Admin.create({
      username,
      password: hashedPassword,
      email,
    });
    await newAdmin.save();
    //Send a response
    res.json(newAdmin);
  } catch (err) {
    res.json(err);
  }
};

// admin login
const login = async (req, res) => {
  try {
    //Get the username and body of req.body
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ msg: "Please complete all the required fields" });
    }
    //Find the admin with requested username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    //Compare entered password with found admin's password hash
    const passwordMatch = bcrypt.compareSync(password, admin.password);
    // send the error message if password is incorrect
    if (!passwordMatch) {
      return res.status(400).json({ msg: "Wrong password" });
    }
    //token expiration
    const exp = Date.now() + 1000 * 60 * 60; // expires in 1 hour from now
    //create jwt token
    const adminId = admin._id;
    const token = jwt.sign({ sub: adminId, exp }, process.env.SECRET);
    // setting the cookie
    res.cookie("Authorization", token, {
      expires: new Date(exp),
      httpOnly: true,
    });
    //send the token
    res.json({ token });
  } catch (err) {
    res.json(err);
  }
};

const checkAuth = async (req, res) => {
  res.sendStatus(200);
};

// log out
const logout = async (req, res) => {
  try {
    //Delete cookie
    res.clearCookie("Authorization", { path: "/", httpOnly: true });
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(401);
  }
};

// get admin's data
const getAdmin = async (req, res) => {
  try {
    //find admin by id
    const admin = await Admin.findOne({ _id: req.admin._id });
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }
    res.status(200).json({ admin });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
  checkAuth,
  logout,
  getAdmin,
};
