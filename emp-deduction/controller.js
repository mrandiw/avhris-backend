const Deduction = require("./model");
const Employment = require("../employee/model");
const AllowDeduct = require("../allow-deduction/model");

module.exports = {
  addDeduction: async (req, res) => {
    try {
      const {
        deduction_id,
        deduction_selfpercent,
        deduction_companypercent,
        emp_id,
      } = req.body;
      const { role } = req.admin;
      // if (role === "Super Admin" || role === "App Admin") {
      const deduction = new Deduction({
        emp_id,
        deduction_id,
        deduction_selfpercent,
        deduction_totalpercent:
          Number(deduction_selfpercent) + Number(deduction_companypercent),
        deduction_companypercent,
      });
      await deduction.save();
      return res.status(200).json({ message: `Successfully added deduction` });
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: `Failed to Add new deduction | Internal Server Error`,
      });
    }
  },
  editDeduction: async (req, res) => {
    try {
      const { deduction_id, deduction_selfpercent, deduction_companypercent } =
        req.body;
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      const deduction = await Deduction.updateOne(
        { _id: id },
        {
          $set: {
            deduction_id,
            deduction_selfpercent,
            deduction_totalpercent:
              Number(deduction_selfpercent) + Number(deduction_companypercent),
            deduction_companypercent,
          },
        }
      );
      if (deduction.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: `Successfully updated deduction` });
      }
      return res.status(422).json({ message: `No data changed` });
      // }
    } catch (error) {
      res.status(500).json({ message: `Failed to edit deduction` });
    }
  },
  getDeductOptionsEmp: async (req, res) => {
    try {
      const emp_id = req?.params?.id;
      const employment = await Employment.findOne({ _id: emp_id });
      const findAllDeduction = await AllowDeduct.find({
        company_id: employment?.company_id,
        ad_type: "Deduction",
        ad_status: true,
      });
      res.status(200).json(findAllDeduction);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getDeduction: async (req, res) => {
    try {
      const emp_id = req?.params?.id;
      const deduction = await Deduction.find({
        emp_id,
      }).populate({
        path: "deduction_id",
        select: "ad_name _id",
      });
      res.status(200).json(deduction);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  deleteDeduction: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      const deduction = await Deduction.deleteOne({ _id: id });
      if (deduction.deletedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully deleted Deduction" });
      }
      // } else {
      //   return res.status(422).json({ message: "Failed To Delete" });
      // }
    } catch (error) {
      res.status(500).json({ message: "Failed to deleted | Server Error" });
    }
  },
  changeStatusDeduction: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      const findDeduction = await Deduction.findOne({ _id: id });
      console.log(findDeduction);
      const deduction = await Deduction.updateOne(
        { _id: id },
        {
          $set: {
            deduction_status: findDeduction?.deduction_status ? false : true,
          },
        }
      );
      console.log(deduction);
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
