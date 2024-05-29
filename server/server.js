import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

//schemas here
import User from "./Schema/User.js";

const server = express();
let PORT = 3000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

server.use(express.json());

server.post("/signup", (req, res) => {
  const { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Full name must be 3 letters long!!" });
  }

  if (!email.length) {
    return res.status(403).json({ error: "enter email!!" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is Invalid" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
    });
  }

  bcrypt.hash(password, 10, (err, hashed_password) => {
    let username = email.split("@")[0];

    let user = new User({
      personal_info: { fullname, email, password: hashed_password, username },
    });

    user
      .save()
      .then((u) => {
        return res.status(200).json({ user: u });
      })
      .catch((err) => {
        if (err.code == 11000) {
          return res
            .status(500)
            .json({ error: "email address already exists" });
        }
        return res.status(500).json({ error: err.message });
      });
  });
});
server.listen(PORT, () => {
  console.log("------------------------------------");
  console.log("Listening on port " + PORT);
  console.log("-------------------------------------");
});
