const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already Registered. Please Login",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    req.body.password = hashedPassword;

    const user = new userModel(req.body);
    await user.save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log("error", error),
      res.status(500).send({
        success: false,
        message: "error in Register API",
        error,
      });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    if(user.role !== req.body.role){
        return res.status(500).send({
            success: false,
            message: "role doesnt match",
          });
    }

    //compare password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!comparePassword) {
      return res.status(500).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({
      success: true,
      message: "User login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log("error", error),
      res.status(500).send({
        success: false,
        message: "error in Login API",
        error,
      });
  }
};

const currentUserController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    res.status(200).send({
      success: true,
      message: "User fetched Successfully",
      user,
    });

  } catch (error) {
    console.log("error", error),
      res.status(500).send({
        success: false,
        message: "error in Get Current User API",
        error,
      });
  }
};

module.exports = { registerController, loginController, currentUserController };
