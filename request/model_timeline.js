const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  request_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "request",
  },
  request_datetime: {
    type: String,
    required: true,
  },
  action_info: {
    type: String,
  },
});

module.exports = mongoose.model("requests_timeline", requestSchema);
