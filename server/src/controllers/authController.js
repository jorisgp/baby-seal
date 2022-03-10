const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const log = require("../utils/logger").logger;

const createToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(
        new AppError(404, "fail", "Please provide Username or Password"),
        req,
        res,
        next
      );
    }

    const user = await User.findOne({
      username,
    }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        new AppError(401, "fail", "Username or Password is wrong"),
        req,
        res,
        next
      );
    }

    const token = createToken(user.id);
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  console.log("signup");
  try {
    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = createToken(user.id);

    user.password = undefined;

    res.status(201).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  log.info("AuthController - protect");
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    log.info("AuthController - protect - token: " + token);
    if (!token) {
      return next(
        new AppError(
          401,
          "fail",
          "You are not logged in! Please login in to continue"
        ),
        req,
        res,
        next
      );
    }

    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    log.info("AuthController - protect - decode: " + decode);
    const user = await User.findById(decode.id);
    if (!user) {
      return next(
        new AppError(401, "fail", "This user is no longer exist"),
        req,
        res,
        next
      );
    }
    log.info("AuthController - protect - user: " + user);
    req.user = user;
    log.info("AuthController - protect - next");
    next();
  } catch (err) {
    next(err);
  }
};

// Authorization check if the user have rights to do this action
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, "fail", "You are not allowed to do this action"),
        req,
        res,
        next
      );
    }
    next();
  };
};
