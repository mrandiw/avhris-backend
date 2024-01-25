const Education = require("./model");

module.exports = {
  addNewEducation: async (req, res) => {
    try {
      const {
        empedu_type,
        empedu_institute,
        empedu_result,
        empedu_year,
        emp_id,
      } = req.body;
      const { role } = req.admin;
      // if (role === "Super Admin" || role === "App Admin") {
      const newEducation = new Education({
        emp_id,
        empedu_type,
        empedu_result,
        empedu_year,
        empedu_institute,
      });
      await newEducation.save();
      return res
        .status(200)
        .json({ message: "Successfully created a Education" });
      // } else {
      //   return res
      //     .status(422)
      //     .json({ message: "You can't add Education to this employment" });
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Add new Education" });
    }
  },
  editEducation: async (req, res) => {
    try {
      const { empedu_type, empedu_institute, empedu_result, empedu_year } =
        req.body;
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      const updateEducation = await Education.updateOne(
        { _id: id },
        {
          $set: {
            empedu_type,
            empedu_result,
            empedu_year,
            empedu_institute,
          },
        }
      );
      return res
        .status(200)
        .json({ message: "Successfully updated Education" });
      // } else {
      //   return res
      //     .status(422)
      //     .json({ message: "You can't add Education to this employment" });
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to edited departement" });
    }
  },
  getEducation: async (req, res) => {
    try {
      const emp_id = req?.query?.emp_id;
      const { role } = req.admin;
      // if (role === "Super Admin" || role === "App Admin") {
      const departemen = await Education.find({
        emp_id,
      });
      res.status(200).json(departemen);
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get Education" });
    }
  },
  deleteEducation: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      const education = await Education.deleteOne({ _id: id });
      if (education.deletedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully deleted Education" });
      }
      // } else {
      //   return res
      //     .status(422)
      //     .json({ message: "You can't delete Education this employment" });
      // }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Failed to deleted education | Server Error" });
    }
  },
};
