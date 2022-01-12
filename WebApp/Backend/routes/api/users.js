import express from "express";
import bcrypt from "bcrypt";
import _ from "lodash";
import cloudinary from "cloudinary";

cloudinary.v2;

const router = express.Router();
import UserModel from "../../models/user.js";
router.get("/", async (req, res) => {
  try {
    let users = await UserModel.find();

    res.send(users);
  } catch (err) {
    console.log(err);
  }
});

//register a new user
router.post("/register", async (req, res) => {
  try {
    let { email, password, confirmPassword } = req.body;

    let user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).send("User Already Registered.");
    }

    if (!email || !password || !confirmPassword) {
      return res.send("All Feilds are Required");
    }

    if (password === confirmPassword) {
      const hashPassword = await bcrypt.hash(password, 10);

      let user = new UserModel();
      user.email = email;
      user.password = hashPassword;
      user.confirmPassword = hashPassword;
      await user.save();

      const token = user.generateAuthToken();
      return res
        .header("x-auth-token", token)
        .send(_.pick(user, ["_id", "email"]));
    } else {
      return res.status(400).send("Password Not Matached");
    }
  } catch (err) {
    console.log(err);
  }
});

//login user
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid Email or Password");
    }
    await bcrypt.compare(password, user.password, (err, valid) => {
      if (valid) {
        const token = user.generateAuthToken();

        return res.status(200).json({
          token: token,
          id: user.id,
          type: user.type,
          name: user.email,
          password: user.password,
        });
      }
      if (!valid) {
        return res.status(400).send("Invalid Email or Password");
      }
    });
    // return res.json();
    // return res.header("x-auth-token", email).send("sucess");
  } catch (err) {
    console.log(err);
  }
});

export default router;
