const route = require("express").Router();
const { default: axios } = require("axios");
const User = require("../db/models/users");

route.post("/signup", (req, resp) => {
  let user = new User(req.body);
  user.save();
  resp.json({
    success: true,
  });
});

route.post("/login", async (req, resp) => {
  let user = await User.findOne(req.body);
  if (user) {
    resp.json({
      user: user,
      success: true,
    });
  } else {
    resp.json({
      success: false,
    });
  }
});

route.get("/get-users", async (req, resp) => {
  let users = await User.find();
  resp.json(users);
});

route.post("/google-login", async (req, res) => {
  const { data } = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo?access_token=" +
      req.body.access_token
  );
  let already = await User.findOne({ user_email: data.email });
  if (already) {
    res.json({ obj: already });
  } else {
    const user = new User({
      user_picture: data.picture,
      user_name: data.name,
      user_email: data.email,
      user_password: data.id,
      user_reviews: [],
    });
    await user.save();
    User.findOne({ user_name: data.name }, (err, obj) => {
      console.log(obj);
      res.json({ obj });
    });
  }
});

module.exports = route;
