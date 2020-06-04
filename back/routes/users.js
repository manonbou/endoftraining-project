const router = require("express").Router();
const User = require("../models/User");
const HttpError = require("../models/Http-error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const { check, validationResult } = require("express-validator");

//------------------------ REGISTER A USER ------------------------------//

router.route("/register").post(async (req, res, next) => {
  const { isValid, error } = validateRegisterInput(req.body);

  if (!isValid) {
    return next(
      new HttpError("The credentials are wrong, please fix them.", 422)
    );
  }
  //console.log(req.body);

  let existingUser;

  try {
    existingUser = await User.findOne({ email: req.body.email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("Email already used.", 422);
    return next(error);
  }

  const password = req.body.password;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const newUser = new User({
    email: req.body.email,
    login: req.body.login,
    password: hashedPassword,
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      "supermotsecret",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: newUser.id, email: newUser.email, token: token });
});

//------------------------ LOGIN A USER ------------------------------//

router.route("/login").post(async (req, res, next) => {
  const { error, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(404).json(error);
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: req.body.email });
    console.log(existingUser);
  } catch (err) {
    const error = new HttpError(
      "Loggin in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  if (existingUser) {
    let match;
    try {
      match = await bcrypt.compare(req.body.password, existingUser.password);
    } catch (err) {
      const error = new HttpError(
        "Logging in failed, please try again later.",
        500
      );
      return next(error);
    }

    if (match === false) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        403
      );
      return next(error);
    }
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supermotsecret",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
});

//------------------------ GET ALL USERS ------------------------------//

router.route("/").get(
  // passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    let users;
    try {
      users = await User.find({}, "-password");
    } catch (err) {
      const error = new HttpError(
        "Fetching users failed, please try again later.",
        500
      );
      return next(error);
    }
    res.json({
      users: users.map((user) => user.toObject({ getters: true })),
    });
  }
);
// --------------------------------------- DISPLAY USER --------------------------

router.route("/profile/:uid").get(async (req, res, next) => {
  const userId = req.params.uid;
  let user;
  try {
    //console.log('1er')
    user = await User.findById(userId);
    console.log(user);
  } catch (err) {
    const error = new HttpError(
      "Display user failed, please try again later.",
      500
    );
    return next(error);
  }

  //console.log('2nd')
  res.json({
    user: user.toObject({ getters: true }),
  });
});

// ---------------------------------EDIT USER PROFILE --------------------------------

router.route("/profile/edit/:uid").patch(
  [
    check("login").isLength({ min: 5, max: 30 }),
    // check("email").isEmail(),
    check("password").notEmpty(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    console.log("test1");

    if (!errors.isEmpty()) {
      // console.log(errors);
      throw new HttpError(
        "Invalid inputs passed, please check your data.",
        422
      );
    }
    const { login, email, password } = req.body;
    const userId = req.params.uid;
    console.log("test2");
    console.log(req.body);

    let user;
    try {
      user = await User.findById(userId);
    } catch (err) {
      const error = new HttpError("Something went wrong, try again.", 500);
      return next(error);
    }
    console.log(req.body);

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError(
        "Could not create user, please try again.",
        500
      );
      return next(error);
    }

    user.login = login;
    user.email = email;
    user.password = hashedPassword;

    console.log(user.login);
    try {
      await user.save();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, user not updated.",
        500
      );
      return next(error);
    }

    res.status(200).json({ user: user.toObject() });
  }
);

// ---------------------------------- DELETE USER -------------------------

router.route("/profile/delete/:uid").delete(async (req, res, next) => {
  const userId = req.params.uid;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("User not found.", 500);
    return next(error);
  }
  try {
    user.deleteOne(user);
  } catch (err) {
    const error = new HttpError("User not deleted", 500);
    return next(error);
  }
  res.status(200).json({
    message: "deleted !",
  });
});

module.exports = router;
