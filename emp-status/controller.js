const EmpStatus = require("./model");

module.exports = {
  addStatus: async (req, res) => {
    try {
      const { empstatus_name, empstatus_color, empstatus_desc } = req.body;
      const company_id = req.query.company_id;
      // if (role === "Super Admin" || role === "App Admin") {
      const add_emp_status = new EmpStatus({
        company_id,
        empstatus_color,
        empstatus_name,
        empstatus_desc,
      });
      await add_emp_status.save();
      return res.status(200).json({ message: "Succesfully add new status" });
      // }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to add new status | Server Error" });
    }
  },
  editStatus: async (req, res) => {
    try {
      const { empstatus_name, empstatus_color, empstatus_desc } = req.body;
      const edit_emp_status = await EmpStatus.updateOne(
        { _id: req.params.id },
        {
          $set: {
            empstatus_color,
            empstatus_name,
            empstatus_desc,
          },
        }
      );
      if (edit_emp_status.modifiedCount > 0) {
        return res.status(200).json({ message: "Succesfully edited status" });
      }
      return res.status(422).json({ message: "No data Changed" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to edited status | Server Error" });
    }
  },
  deleteStatus: async (req, res) => {
    try {
      const { role } = req.admin;
      // if (role === "Super Admin" || role === "App Admin") {
      const edit_emp_status = await EmpStatus.deleteOne({ _id: req.params.id });
      if (edit_emp_status.deletedCount > 0) {
        return res.status(200).json({ message: "Succesfully deleted status" });
      }
      return res.status(422).json({ message: "Failed | No Status Deleted" });
      // }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to deleted status | Server Error" });
    }
  },
  getStatus: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      console.log(company_id);
      const get_emp_status = await EmpStatus.find({
        company_id,
      });
      return res.status(200).json(get_emp_status);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to get status | Server Error" });
    }
  },
};
