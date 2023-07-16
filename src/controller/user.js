const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const generateToken = require("../common/utility");


const register = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the fields");
    }

    const userExists = await User.findOne({email});
    if (userExists) {
        res.status(400);
        throw new Error("User already Exists");
    }

    const user = await User.create({
        name, email, password,
    });

    if (user) {
        res.status(201).json({
            userCode: user.code, name: user.name, email: user.email,
        });
    } else {
        res.status(400);
        throw new Error("Failed to create a user");
    }
});

const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (user && (await user.matchPassword(password))) {
        res.status(200);
        res.json({
            userCode: user.code,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});
// @desc  Update User Profile
// @route PUT /api/v1/biz/profile
// @access  Private

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.email = req.body.email || user.email;
        if (req.body.password)
            user.password = req.body.password || user.password;
        const updatedUser = await user.save();

        res.status(201).json({
            _id: updatedUser._id,
            email: updatedUser.email,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error("User Not found");
    }
});

module.exports = {register, login, getUserProfile, updateUserProfile};

