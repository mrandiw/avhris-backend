const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const outputFileSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "description is a required field"],
    },
    type_file: {
      type: String,
      required: [true, "type file is a required field"],
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OutputFile", outputFileSchema);
