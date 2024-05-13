const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//GET-ALL-USERS
router.get(`/`, async (req, res) => {
  const userList = await User.find();
  if (!userList)
    return res.status(500).json({ message: "No Product  in database ..." });
  res.status(200).send(userList);
});

//Get specific user by id
router.get(`/:id`, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(500).json({ message: "No User in database ..." });
  res.status(200).send(user);
});
//ADD-USER-MANUALLY
router.post("/", async (req, res) => {
  let user = new User(
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      AdminCheck: req.body.AdminCheck,
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      country: req.body.country,
    }
    // { new: true }
  );
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});
//UPDATED-USER
router.put("/:id", async (req, res) => {
  const userExist = await User.findById(req.params.id);
  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.passwordHash;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

//login 
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("password is wrong!");
  }
});
//USER-REGISTER
router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

//USER-DELETE
router.delete("/:id", async (req, res) => {
  User.findByIdAndDelete(req.params.id).then((user) => {
    if (user) {
      return res.status(200).json({
        success: true,
        message: "The User Has been deleted Successfully ! .. ",
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: " The User Cannot be deleted ! .." });
    }
  });
});
//USER-COUNTS (How mnay users in my app ?)
router.get("/get/count", async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    res.send({
      userCount: userCount,
    });
  } catch (error) {
    console.error("Error counting documents:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
