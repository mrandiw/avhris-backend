const mongoose = require("mongoose");

const NotifSchema = mongoose.Schema({
  emp_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employment",
  },
  notif_title: {
    type: String,
    required: true,
  },
  notif_message: {
    type: String,
  },
  notif_datetime: {
    type: String,
  },
  notif_for: {
    type: String,
    enum: ["Employee", "Admin"],
  },
});

module.exports = mongoose.model("notification", NotifSchema);
