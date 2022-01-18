const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middlewares/fetchuser");
// create a User Using POST: Endpoint : /api/auth/createUser // No Login Required

const JWT_SECRET = "Vijayisagood$oy";

router.post(
  "/createuser",
  [
    body("name", "Enter a Valid Name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Enter a valid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    // if There is No errors Return Bad Error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check weather the user email is already exits

    try {
      let user = await User.findOne({ email: req.body.email });
      console.log(user);
      if (user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Sorry Email is Already Registered.." });
      }

      // Create Secure Password using Bcrypt JS
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });

      // Generate JWT Token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      // Send JWT Token as a Response
      res.json({ success, authToken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Login / Authneticate a User Route using POST : aut/api/login ". No Login Required"

router.post(
  "/login",
  [
    body("email", "enter valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // if There is No errors Return Bad Error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // Find email of user if there is exits
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ error: "please try to login with correct credentials" });
      }

      // Compare Password With Hash
      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "please try to login with correct credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Sevrer Error");
    }
  }
);

// Route 3 - get Logged in USer Detail - POST /api/auth/getusers Login Required
router.post("/getusers", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Sevrer Error");
  }
});
module.exports = router;
