const Experience = require("./model");

module.exports = {
  addNewExperienc: async (req, res) => {
    try {
      const {
        empexp_company,
        empexp_comp_position,
        empexp_startdate,
        empexp_endate,
        emp_id,
      } = req.body;
      const { role } = req.admin;
      // if (role === "Super Admin" || role === "App Admin") {
      const experience = new Experience({
        empexp_company,
        empexp_comp_position,
        empexp_startdate,
        empexp_endate,
        emp_id,
      });
      await experience.save();
      return res.status(200).json({ message: "Successfully added experience" });
      // } else {
      //   return res
      //     .status(422)
      //     .json({ message: "You can't add experience to this employment" });
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Add new experience" });
    }
  },
  editExperience: async (req, res) => {
    try {
      const {
        empexp_company,
        empexp_comp_position,
        empexp_startdate,
        empexp_endate,
      } = req.body;
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      const experience = await Experience.updateOne(
        { _id: id },
        {
          $set: {
            empexp_company,
            empexp_comp_position,
            empexp_startdate,
            empexp_endate,
          },
        }
      );
      return res
        .status(200)
        .json({ message: "Successfully updated experience" });
      // } else {
      //   return res
      //     .status(422)
      //     .json({ message: "You can't updated experience this employment" });
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to edited experience" });
    }
  },
  getExperience: async (req, res) => {
    try {
      const emp_id = req?.query?.emp_id;
      const { role } = req.admin;
      // if (role === "Super Admin" || role === "App Admin") {
      const experience = await Experience.find({
        emp_id,
      });
      res.status(200).json(experience);
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get experience" });
    }
  },
  deleteExperience: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      const education = await Experience.deleteOne({ _id: id });
      if (education.deletedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully deleted experience" });
      }
      // } else {
      //   return res
      //     .status(422)
      //     .json({ message: "You can't delete experience this employment" });
      // }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Failed to deleted experience | Server Error" });
    }
  },
};
