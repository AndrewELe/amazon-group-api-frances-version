const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, 'secret');
    const user = await User.findOne({ _id: data._id });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send('Not Authorized');
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user)
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      res.status(400).send('Invalid login credentials');
    } else {
      const token = await user.generateAuthToken();
  
      res.json({ user, token,message:`login sucessful! Welcome, ${user.email}`});
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const user = await User.findOne({ _id: req.params.id });
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.json({user, message:`updated user info`});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// user.findOneAndUpdate  (this is the single line code for finding one and updating)


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    user.deleteOne()
    res.json({ message: 'User Deleted' });
    res.json
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    const user  =  await req.body.email
    // const token = null;
    res.json({ user, message:'Logout Sucessful'} );
    
  } catch (error) {
    res.status(421).json({ message: error.message });
  }
};

exports.listUsers = async (req, res) => {
  try {

   const listUsers = await User.find({});
   console.log(listUsers)
     res.json({            // this is where the bug was, "res.render" was sending a webpage with html data, and not actual json data
       users: listUsers,
     });
    
  }
   catch (error) {
    res.status(421).json({ message: error.message });
  }
};
