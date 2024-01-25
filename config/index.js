require("dotenv").config();
const CONFIG = {
  mongodb_url: process.env.MONGODB_URL_PROD,
  port: process.env.PORT,
};

module.exports = CONFIG;
