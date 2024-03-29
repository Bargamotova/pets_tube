import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

// register
export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newEmail = req.body.email.toLowerCase();
    const newUser = new User({ ...req.body, password: hash, email: newEmail });
    // await newUser.save();
    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
    const tokenActive = token;
    const { password, ...others } = newUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ ...others, tokenActive });
  } catch (err) {
    next(err);
  }
};
//  login
export const signIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) next(createError(404, 'User not found!'));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) next(createError(400, 'Wrong credentials!'));

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const tokenActive = token;
    const { password, ...others } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true
      })
      .status(200)
      .json({ ...others, tokenActive });
  } catch (err) {
    next(err);
  }
};
//  google
export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });

      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      const tokenActive = token;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ ...savedUser._doc, tokenActive });
    }
  } catch (err) {
    next(err);
  }
};

