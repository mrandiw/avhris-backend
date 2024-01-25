const Location = require("./model");
const Employment = require("../employee/model");

module.exports = {
  addLocation: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      const location = new Location({
        ...req.body,
        company_id,
      });
      await location.save();
      return res.status(200).json({ message: "Successfuly add new location" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed add new location" });
    }
  },
  editLocation: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      const location = await Location.updateOne(
        { _id: req.params.id },
        {
          $set: {
            ...req.body,
            company_id,
          },
        }
      );
      return res.status(200).json({ message: "Successfuly edited location" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed add new location" });
    }
  },
  deleteLocation: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      const location = await Location.deleteOne({ _id: req.params.id });
      return res.status(200).json({ message: "Successfuly deleted location" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed deleted location" });
    }
  },
  getLocation: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      const location = await Location.find().populate("company_id");
      // if (role === "Super Admin " || role === "Group Admin") {
      return res.status(200).json(location);
      // } else {
      //   return res.status(200).json([]);
      // }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed get location" });
    }
  },
};
