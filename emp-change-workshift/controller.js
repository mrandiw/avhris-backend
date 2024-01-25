const ChangeShift = require("./model");
const Employment = require("../employee/model");
const { populate } = require("./model");

function getDateNow() {
  let today = new Date();
  let date = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;
  return date;
}

function getDayName(date_string) {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const date = new Date(date_string);
  const dayName = days[date.getUTCDay()];
  return dayName;
}

module.exports = {
  addChangeWorkshift: async (req, res) => {
    try {
      const {
        emp_id,
        empchange_to,
        empchange_reason,
        empchange_replacement,
        empchange_date_request,
      } = req.body;
      const employement = await Employment.findOne({ _id: emp_id });
      const empchange_shift_before =
        employement?.emp_attadance[
          getDayName(empchange_date_request).toLocaleLowerCase()
        ]?.shift;
      // if (empchange_shift_before === empchange_to) {
      //   return res
      //     .status(422)
      //     .json({ message: "Cannot change with same shift" });
      // }
      const payload = {
        company_id: employement?.company_id,
        emp_id,
        empchange_to,
        empchange_shift_before,
        empchange_reason,
        empchange_replacement,
        empchange_date_request,
        empchange_request: getDateNow(),
        empchange_fsuperior: { fsuperior_id: employement?.emp_fsuperior },
        empchange_ssuperior: {
          ssuperior_id: employement.emp_ssuperior
            ? employement.emp_ssuperior
            : employement?.emp_fsuperior,
        },
      };
      const changeShift = new ChangeShift(payload);
      await changeShift.save();
      return res
        .status(200)
        .json({ message: "Successfully added Request Change Workshift" });
    } catch (error) {
      console.log(error.message);
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to Request Change Workshift | Server Error" });
    }
  },
  editDataChangeRequest: async (req, res) => {
    try {
      const {
        emp_id,
        empchange_to,
        empchange_reason,
        empchange_replacement,
        empchange_date_request,
      } = req.body;
      const employement = await Employment.findOne({ _id: emp_id });
      const empchange_shift_before =
        employement?.emp_attadance[
          getDayName(empchange_date_request).toLocaleLowerCase()
        ]?.shift;
      // if (empchange_shift_before === empchange_to) {
      //   return res
      //     .status(422)
      //     .json({ message: "Cannot change with same shift" });
      // }
      const payload = {
        company_id: employement?.company_id,
        emp_id,
        empchange_to,
        empchange_shift_before,
        empchange_reason,
        empchange_replacement,
        empchange_date_request,
        empchange_request: getDateNow(),
      };
      const changeShift = await ChangeShift.updateOne(
        { _id: req.params.id },
        { $set: { ...payload } }
      );
      if (changeShift.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully edited Request Change Workshift" });
      } else {
        return res
          .status(500)
          .json({ message: "Failed to Request Change Workshift" });
      }
    } catch (error) {
      return res
        .status(422)
        .json({ message: "Failed to Request Change Workshift | Server Error" });
    }
  },
  getChangeShiftRequest: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      // if (req.admin.role === "Super Admin" || req.admin.role === "App Admin") {
      const changeShift = await ChangeShift.find({
        company_id,
      })
        .populate({
          path: "emp_id",
          select: "emp_fullname _id emp_depid",
          populate: {
            path: "emp_depid",
            select: "dep_name",
          },
        })
        .populate({
          path: "empchange_replacement",
          select: "emp_fullname _id emp_depid",
          populate: {
            path: "emp_depid",
            select: "dep_name",
          },
        })
        .populate({
          path: "empchange_shift_before",
          select: "shift_name _id shift_desc",
        })
        .populate({
          path: "empchange_to",
          select: "shift_name _id shift_desc",
        })
        .populate({
          path: "company_id",
          select: "company_name",
        })
        .populate({
          path: "empchange_fsuperior.fsuperior_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        })
        .populate({
          path: "empchange_ssuperior.ssuperior_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        });

      res.status(200).json(changeShift);
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get Shift Change Request" });
    }
  },
  editChangeRequest: async (req, res) => {
    try {
      const { empchange_fsuperior, empchange_ssuperior, empchange_hr } =
        req.body;
      const findChangeRequest = await ChangeShift.findOne({
        _id: req.params.id,
      });
      const overtimeRequest = await ChangeShift.updateOne(
        { _id: req.params.id },
        {
          $set: {
            empchange_fsuperior: {
              ...findChangeRequest?.empchange_fsuperior,
              status: empchange_fsuperior?.status,
              approved_by: empchange_fsuperior?.approved_by,
              approved_date:
                findChangeRequest?.empchange_fsuperior?.status ===
                empchange_fsuperior?.status
                  ? findChangeRequest?.empchange_fsuperior.approved_date
                  : empchange_fsuperior?.approved_date,
              approved_hours:
                findChangeRequest?.empchange_fsuperior?.status ===
                empchange_fsuperior?.status
                  ? findChangeRequest?.empchange_fsuperior?.approved_hours
                  : empchange_fsuperior?.approved_hours,
            },
            empchange_ssuperior: {
              ...findChangeRequest?.empchange_ssuperior,
              status: empchange_ssuperior?.status,
              approved_by: empchange_ssuperior?.approved_by,
              approved_date:
                findChangeRequest?.empchange_ssuperior?.status ===
                empchange_ssuperior?.status
                  ? findChangeRequest?.empchange_ssuperior?.approved_date
                  : empchange_ssuperior?.approved_date,
              approved_hours:
                findChangeRequest?.empchange_ssuperior?.status ===
                empchange_ssuperior?.status
                  ? findChangeRequest?.empchange_ssuperior.approved_hours
                  : empchange_ssuperior?.approved_hours,
            },
            empchange_hr: {
              ...findChangeRequest?.empchange_hr,
              status: empchange_hr?.status,
              approved_by: empchange_hr?.approved_by,
              approved_date:
                findChangeRequest?.empchange_hr?.status === empchange_hr?.status
                  ? findChangeRequest?.empchange_hr?.approved_date
                  : empchange_hr?.approved_date,
              approved_hours:
                findChangeRequest?.empchange_hr?.status === empchange_hr?.status
                  ? findChangeRequest?.empchange_hr.approved_hours
                  : empchange_hr?.approved_hours,
            },
          },
        }
      );
      if (overtimeRequest.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully edit status change shift" });
      }
    } catch (error) {
      console.log(error.message);
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to edit status change shift | Server Error" });
    }
  },
  deleteChangeRequest: async (req, res) => {
    try {
      const overtimeRequest = await ChangeShift.deleteOne({
        _id: req.params.id,
      });
      if (overtimeRequest.deletedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully deleted Change Shift Request" });
      } else {
        return res
          .status(500)
          .json({ message: "Failed deleted Change Shift Request" });
      }
    } catch (error) {
      console.log(error.message);
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed deleted Change Shift Request" });
    }
  },
};
