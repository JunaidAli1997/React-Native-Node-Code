const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
var { expressjwt: jwt } = require("express-jwt");

// middleware
const requireSignIn = jwt({
  secret: "jhsdfkjfdg@ldfkng",
  algorithms: ["HS256"],
});

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and 6 character long",
      });
    }
    //existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(500).send({
        success: false,
        message: "User Already Register with this Email",
      });

    // hased password
    const hashedPassword = await hashPassword(password);

    // save user in database
    const user = await userModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "Registration Successfull please login",
    });
  } catch (error) {
    console.log("err", error);
    return res.status(500).send({
      success: false,
      message: "Error in Register API",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please Provide Email and Password",
      });
    }

    // find user
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(500).send({
        success: false,
        message: "User Not Found",
      });

    // match password
    const match = await comparePassword(password, user.password);
    if (!match)
      return res.status(500).send({
        success: false,
        message: "Invalid username or password",
      });

    // token JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // undefined password
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "User Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log("err", error);
    return res.status(500).send({
      success: false,
      message: "Error in Login API",
      error,
    });
  }
};

const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    // find user
    const user = await userModel.findOne({ email });

    // password validtation
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and should be 6 character long",
      });
    }

    // hased password
    const hashedPassword = password ? await hashPassword(password) : undefined;

    // updated user
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully, Please Login",
      updatedUser,
    });
  } catch (error) {
    console.log("err", error);
    return res.status(500).send({
      success: false,
      message: "Error in User Update API",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  updateUserController,
  requireSignIn,
};
