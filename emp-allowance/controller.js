const Allowance = require("./model");
const Employment = require("../employee/model");
const AllowDeduct = require("../allow-deduction/model");

module.exports = {
  addAllowance: async (req, res) => {
    try {
      const {
        empallow_allowance_id,
        empallow_allowance_amount,
        empallow_allowance_status,
        emp_id,
        empallow_allowance_type,
      } = req.body;
      const { role } = req.admin;
      // if (role === "Super Admin" || role === "App Admin") {
      const empallow_allowance_additional = "0";
      const allowance = new Allowance({
        emp_id,
        empallow_allowance_id,
        empallow_allowance_amount,
        empallow_allowance_additional,
        empallow_allowance_status,
        empallow_allowance_type,
      });
      await allowance.save();
      return res.status(200).json({ message: `Successfully added Allowance` });
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `Failed to Add new Allowance` });
    }
  },
  editAllowance: async (req, res) => {
    try {
      const {
        empallow_allowance_id,
        empallow_allowance_amount,
        empallow_allowance_status,
        empallow_allowance_type,
      } = req.body;
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      const allowance = await Allowance.updateOne(
        { _id: id },
        {
          $set: {
            empallow_allowance_id,
            empallow_allowance_amount,
            empallow_allowance_type,
          },
        }
      );
      if (allowance.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: `Successfully updated Allowance` });
      }
      return res.status(422).json({ message: `No data changed` });
      // }
    } catch (error) {
      res.status(500).json({ message: `Failed to edit Allowance` });
    }
  },
  getAllowOptionsEmp: async (req, res) => {
    try {
      const emp_id = req?.params?.id;
      const employment = await Employment.findOne({ _id: emp_id });
      const findAllAllowance = await AllowDeduct.find({
        company_id: employment?.company_id,
        ad_type: "Allowance",
        ad_status: true,
      });
      res.status(200).json(findAllAllowance);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getAllowance: async (req, res) => {
    try {
      const emp_id = req?.params?.id;
      const allowance = await Allowance.find({
        emp_id,
      }).populate({
        path: "empallow_allowance_id",
        select: "ad_name _id",
      });
      res.status(200).json(allowance);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  deleteAllowance: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      const allowance = await Allowance.deleteOne({ _id: id });
      if (allowance.deletedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully deleted Allowance" });
      }
      // }
    } catch (error) {
      res.status(500).json({ message: "Failed to deleted | Server Error" });
    }
  },
  changeStatusAllowance: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      const findAllowance = await Allowance.findOne({ _id: id });
      const allowance = await Allowance.updateOne(
        { _id: id },
        {
          $set: {
            empallow_allowance_status: findAllowance.empallow_allowance_status
              ? false
              : true,
          },
        }
      );
      return res.status(200).json({
        message: `Successfully updated status`,
      });
      // }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: `Failed to edit status | Internal Server Error` });
    }
  },
};
