import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken"
import cors from "cors"

//schemas here
import User from "./Schema/User.js";

const server = express();

let PORT = 3000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

//CONNECT TO MONGODB

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});


const formatDataToSend = (user) => {
    

        const access_token = jwt.sign({id: user._id}, process.env.SECRET_ACCESS_KEY)
        return{
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}

const generateUsername = async (email) => {
    let username = email.split("@")[0];
    let isUsernameNotUnique = await User.exists({"personal_info.username" : username}).then((result) => result)

    isUsernameNotUnique ? username += nanoid().substring(0, 5) : ""
    return username

}

server.use(express.json());
server.use(cors())

//SIGN UP SERVER
server.post("/signup", (req, res) => {
  const { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Full name must be 3 letters long!!" });
  }

  if (!email.length) {
    return res.status(403).json({ error: "Enter email!!" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is Invalid" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
    });
  }

  bcrypt.hash(password, 10, async(err, hashed_password) => {
    let username = await generateUsername(email)

    let user = new User({
      personal_info: { fullname, email, password: hashed_password, username },
    });

    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDataToSend(u));
      })
      .catch((err) => {
        if (err.code == 11000) {
          return res
            .status(500)
            .json({ error: "Email address already exists" });
        }
        return res.status(500).json({ error: err.message });
      });
  });
});


//SIGN IN SERVER

server.post("/signin", (req, res) => {
  let { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({ error: "Email not found" });
      }
      bcrypt
        .compare(password, user.personal_info.password)
        .then((isMatch) => {
          if (isMatch) {
            return res.status(200).json({ status: "Login successful" });
          } else {
            return res.status(403).json({ error: "Invalid password" });
          }
        })
        .catch((err) => {
          console.log(err.message);
          return res.status(500).json({ error: err.message });
        });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});
server.listen(PORT, () => {
  console.log("------------------------------------");
  console.log("Listening on port " + PORT);
  console.log("-------------------------------------");
});
