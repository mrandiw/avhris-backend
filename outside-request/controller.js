const OvertimeRequest = require("./model");
const Employment = require("../employee/model");
const { populate } = require("./model");

function formatHours(jam, menit) {
  return `${jam < 10 ? "0" + jam.toString() : jam.toString()}:${
    menit < 10 ? "0" + menit.toString() : menit.toString()
  } Hours`;
}

function getDurationOutside(start_date, end_date) {
  let date1 = start_date;
  let date2 = end_date;
  date1 = new Date(Date.parse(date1));
  date2 = new Date(Date.parse(date2));
  const getDuration = (date2 - date1) / (24 * 60 * 60 * 1000);
  return `${getDuration} Day`;
}
module.exports = {
  addOvertimeRequest: async (req, res) => {
    try {
      const { emp_id, outside_reason, outside_start_date, outside_end_date } =
        req.body;
      const employement = await Employment.findOne({ _id: emp_id });
      const payload = {
        company_id: employement?.company_id,
        emp_id,
        outside_reason,
        outside_start_date,
        outside_end_date,
        outside_duration: getDurationOutside(
          outside_start_date,
          outside_end_date
        ),
        outside_fsuperior: { fsuperior_id: employement?.emp_fsuperior },
        outside_ssuperior: {
          ssuperior_id: employement.emp_ssuperior
            ? employement.emp_ssuperior
            : employement?.emp_fsuperior,
        },
      };
      const overtimeRequest = new OvertimeRequest(payload);
      await overtimeRequest.save();
      return res
        .status(200)
        .json({ message: "Successfully added Request Outside" });
    } catch (error) {
      console.log(error.message);
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to added Request Outside | Server Error" });
    }
  },
  editDataOvertimeRequest: async (req, res) => {
    try {
      const { emp_id, outside_reason, outside_start_date, outside_end_date } =
        req.body;
      const employement = await Employment.findOne({ _id: emp_id });
      const payload = {
        company_id: employement?.company_id,
        emp_id,
        outside_reason,
        outside_start_date,
        outside_end_date,
        outside_duration: getDurationOutside(
          outside_start_date,
          outside_end_date
        ),
      };
      const overtimeRequest = await OvertimeRequest.updateOne(
        { _id: req.params.id },
        {
          $set: {
            ...payload,
          },
        }
      );
      if (overtimeRequest.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully edited Request Outside" });
      } else {
        return res
          .status(422)
          .json({ message: "Failed to edited Request Outside" });
      }
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ message: "Failed to edited Request Outside" });
    }
  },
  getOvertimeRequest: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      // if (req.admin.role === "Super Admin" || req.admin.role === "App Admin") {
      const overtimeRequest = await OvertimeRequest.find({
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
          path: "company_id",
          select: "company_name",
        })
        .populate({
          path: "outside_fsuperior.fsuperior_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        })
        .populate({
          path: "outside_ssuperior.ssuperior_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        });

      res.status(200).json(overtimeRequest);
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get Outside Request" });
    }
  },
  editOvertimeRequest: async (req, res) => {
    try {
      const { outside_fsuperior, outside_ssuperior, outside_hr } = req.body;
      const findOvertime = await OvertimeRequest.findOne({
        _id: req.params.id,
      });
      const overtimeRequest = await OvertimeRequest.updateOne(
        { _id: req.params.id },
        {
          $set: {
            outside_fsuperior: {
              ...findOvertime?.outside_fsuperior,
              status: outside_fsuperior?.status,
              approved_by: outside_fsuperior?.approved_by,
              approved_date:
                findOvertime?.outside_fsuperior?.status ===
                outside_fsuperior?.status
                  ? findOvertime?.outside_fsuperior.approved_date
                  : outside_fsuperior?.approved_date,
              approved_hours:
                findOvertime?.outside_fsuperior?.status ===
                outside_fsuperior?.status
                  ? findOvertime?.outside_fsuperior?.approved_hours
                  : outside_fsuperior?.approved_hours,
            },
            outside_ssuperior: {
              ...findOvertime?.outside_ssuperior,
              status: outside_ssuperior?.status,
              approved_by: outside_ssuperior?.approved_by,
              approved_date:
                findOvertime?.outside_ssuperior?.status ===
                outside_ssuperior?.status
                  ? findOvertime?.outside_ssuperior?.approved_date
                  : outside_ssuperior?.approved_date,
              approved_hours:
                findOvertime?.outside_ssuperior?.status ===
                outside_ssuperior?.status
                  ? findOvertime?.outside_ssuperior.approved_hours
                  : outside_ssuperior?.approved_hours,
            },
            outside_hr: {
              ...findOvertime?.outside_hr,
              status: outside_hr?.status,
              approved_by: outside_hr?.approved_by,
              approved_date:
                findOvertime?.outside_hr?.status === outside_hr?.status
                  ? findOvertime?.outside_hr?.approved_date
                  : outside_hr?.approved_date,
              approved_hours:
                findOvertime?.outside_hr?.status === outside_hr?.status
                  ? findOvertime?.outside_hr.approved_hours
                  : outside_hr?.approved_hours,
            },
          },
        }
      );
      if (overtimeRequest.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully edit status outside" });
      }
    } catch (error) {
      console.log(error.message);
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to edit status outisde | Server Error" });
    }
  },
  deleteOvertimeRequest: async (req, res) => {
    try {
      const overtimeRequest = await OvertimeRequest.deleteOne({
        _id: req.params.id,
      });

      if (overtimeRequest.deletedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully deleted  Outside Request" });
      } else {
        return res
          .status(500)
          .json({ message: "Failed to deleted  Outside Request " });
      }
    } catch (error) {
      console.log(error.message);
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to deleted  Outside Request " });
    }
  },
};
