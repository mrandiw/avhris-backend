const mongoose = require("mongoose");

const PeriodicSchema = mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  periodic_start_date: {
    type: String,
    required: [true, "Periodic Start Date required"],
  },
  periodic_end_date: {
    type: String,
    required: [true, "Periodic End Date required"],
  },
  periodic_years: {
    type: String,
    required: [true, "Periodic Years required"],
  },
  periodic_month: {
    type: String,
    required: [true, "Periodic Month required"],
  },
  periodic_status: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("periodic", PeriodicSchema);
