const OvertimeRequest = require("./model");
const Employment = require("../employee/model");
const Salary = require("../salary/model");
const { getFormattedDateTime } = require("../leave-request/controller");
const Request = require("../request/model");

function formatHours(jam, menit) {
  return `${jam < 10 ? "0" + jam.toString() : jam.toString()}:${
    menit < 10 ? "0" + menit.toString() : menit.toString()
  } Hours`;
}

function getDurationOvertime(start_hours, end_hours) {
  const start_time = new Date(`1970-01-01T${start_hours}:00`);
  const end_time = new Date(`1970-01-01T${end_hours}:00`);
  const diffrent = end_time - start_time;

  const hour = Math.floor(diffrent / (1000 * 60 * 60));
  const minute = Math.floor((diffrent % (1000 * 60 * 60)) / (1000 * 60));

  return formatHours(hour, minute);
}

async function getTotalOvertimeAmount(emp_id, start_hours, end_hours) {
  const totalHours = +getDurationOvertime(start_hours, end_hours).split(":")[0];
  const salary = await Salary.findOne({ emp_id });
  if (salary) {
    console.log(salary);
    const overtimeAmount =
      (salary?.emp_salary /
        salary?.emp_working_days /
        salary?.emp_working_hours) *
      totalHours;
    return overtimeAmount;
  }
  return 1;
}

function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

module.exports = {
  addOvertimeRequest: async (req, res) => {
    try {
      const {
        emp_id,
        overtime_reason,
        overtime_date,
        overtime_start_hours,
        overtime_end_hours,
      } = req.body;
      const employement = await Employment.findOne({ _id: emp_id });
      const payload = {
        company_id: employement?.company_id,
        emp_id,
        overtime_date,
        overtime_end_hours,
        overtime_start_hours,
        overtime_reason,
        overtime_duration: getDurationOvertime(
          overtime_start_hours,
          overtime_end_hours
        ),
        overtime_amount: await getTotalOvertimeAmount(
          emp_id,
          overtime_start_hours,
          overtime_end_hours
        ),
        overtime_created: getFormattedDate(),
        overtime_fsuperior: { fsuperior_id: employement?.emp_fsuperior },
        overtime_ssuperior: {
          ssuperior_id: employement.emp_ssuperior
            ? employement.emp_ssuperior
            : employement?.emp_fsuperior,
        },
      };
      const overtimeRequest = new OvertimeRequest(payload);
      await overtimeRequest.save().then(async (overtime) => {
        const request = new Request({
          company_id: employement?.company_id,
          request_data_id: overtime?._id,
          request_type: "Overtime",
          request_datetime: getFormattedDateTime(),
        });
        await request.save();
      });
      return res
        .status(200)
        .json({ message: "Successfully added Request Leave" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to added Request Leave | Server Error" });
    }
  },
  editDataOvertimeRequest: async (req, res) => {
    try {
      const {
        emp_id,
        overtime_reason,
        overtime_date,
        overtime_start_hours,
        overtime_end_hours,
      } = req.body;
      const payload = {
        emp_id,
        overtime_date,
        overtime_end_hours,
        overtime_start_hours,
        overtime_reason,
        overtime_duration: getDurationOvertime(
          overtime_start_hours,
          overtime_end_hours
        ),
        overtime_amount: await getTotalOvertimeAmount(
          emp_id,
          overtime_start_hours,
          overtime_end_hours
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
          .json({ message: "Successfully edited Request Leave" });
      } else {
        return res
          .status(500)
          .json({ message: "Failed to edited Request Leave" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to edited Request Leave | Server Error" });
    }
  },
  getOvertimeRequest: async (req, res) => {
    try {
      const company_id = req.query.company_id;
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
          path: "overtime_fsuperior.fsuperior_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        })
        .populate({
          path: "overtime_ssuperior.ssuperior_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        })
        .populate({
          path: "overtime_hr.hr_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        });

      res.status(200).json(overtimeRequest);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get Departement" });
    }
  },
  editOvertimeRequest: async (req, res) => {
    try {
      const { overtime_fsuperior, overtime_ssuperior, overtime_hr } = req.body;
      const findOvertime = await OvertimeRequest.findOne({
        _id: req.params.id,
      });
      const overtimeRequest = await OvertimeRequest.updateOne(
        { _id: req.params.id },
        {
          $set: {
            overtime_fsuperior: {
              ...findOvertime?.overtime_fsuperior,
              status: overtime_fsuperior?.status,
              approved_by: overtime_fsuperior?.approved_by,
              approved_date:
                findOvertime?.overtime_fsuperior?.status ===
                overtime_fsuperior?.status
                  ? findOvertime?.overtime_fsuperior.approved_date
                  : overtime_fsuperior?.approved_date,
              approved_hours:
                findOvertime?.overtime_fsuperior?.status ===
                overtime_fsuperior?.status
                  ? findOvertime?.overtime_fsuperior?.approved_hours
                  : overtime_fsuperior?.approved_hours,
            },
            overtime_ssuperior: {
              ...findOvertime?.overtime_ssuperior,
              status: overtime_ssuperior?.status,
              approved_by: overtime_ssuperior?.approved_by,
              approved_date:
                findOvertime?.overtime_ssuperior?.status ===
                overtime_ssuperior?.status
                  ? findOvertime?.overtime_ssuperior?.approved_date
                  : overtime_ssuperior?.approved_date,
              approved_hours:
                findOvertime?.overtime_ssuperior?.status ===
                overtime_ssuperior?.status
                  ? findOvertime?.overtime_ssuperior.approved_hours
                  : overtime_ssuperior?.approved_hours,
            },
            overtime_hr: {
              ...findOvertime?.overtime_hr,
              status: overtime_hr?.status,
              approved_by: overtime_hr?.approved_by,
              approved_date:
                findOvertime?.overtime_hr?.status === overtime_hr?.status
                  ? findOvertime?.overtime_hr?.approved_date
                  : overtime_hr?.approved_date,
              approved_hours:
                findOvertime?.overtime_hr?.status === overtime_hr?.status
                  ? findOvertime?.overtime_hr.approved_hours
                  : overtime_hr?.approved_hours,
            },
          },
        }
      );
      if (overtimeRequest.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully edit status Request Leave" });
      }
    } catch (error) {
      console.log(error.message);
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to added Request Leave | Server Error" });
    }
  },
  deleteOvertimeRequest: async (req, res) => {
    try {
      const overtimeRequest = await OvertimeRequest.deleteOne({
        _id: req.params.id,
      });
      if (overtimeRequest.deletedCount > 0) {
        await Request.deleteOne({ request_data_id: req.params.id });

        return res
          .status(200)
          .json({ message: "Successfully deleted Request Leave" });
      } else {
        return res
          .status(500)
          .json({ message: "Failed to deleted Request Leave" });
      }
    } catch (error) {
      console.log(error);
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to deleted Request Leave" });
    }
  },
};
