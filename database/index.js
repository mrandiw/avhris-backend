const mongoose = require("mongoose");
const CONFIG = require("../config");
mongoose
  .connect(CONFIG.mongodb_url)
  .then(() => {
    console.log("mongodb success connected");
  })
  .catch((err) => {
    console.log("mongodb failed connected", err);
  });
