const Leave = require("../leave-request/model");
const Overtime = require("../overtime-request/model");
const Outside = require("../outside-request/model");
const ChangeOffDay = require("../off-day/model");
const Workshift = require("../emp-change-workshift/model");

module.exports = {
  getNeedApproval: async (req, res) => {
    try {
      const { departement_id, employee_id } = req.query;

      const company_id = req.query.company_id;
      let match = {};
      if (departement_id) {
        match._id = departement_id;
      }
      let leavequery = {
        company_id,
        empleave_status: "Pending",
      };
      let overtimequery = {
        company_id,
        overtime_status: "Pending",
      };
      let outsidequery = {
        company_id,
        outside_status: "Pending",
      };
      let offday_query = {
        company_id,
        offday_status: "Pending",
      };
      let empchange_query = {
        company_id,
        empchange_status: "Pending",
      };
      if (employee_id) {
        leavequery = {
          ...leavequery,
          emp_id: employee_id,
        };
        overtimequery = {
          ...overtimequery,
          emp_id: employee_id,
        };
        outsidequery = {
          ...outsidequery,
          emp_id: employee_id,
        };
        offday_query = {
          ...offday_query,
          emp_id: employee_id,
        };
        empchange_query = {
          ...empchange_query,
          emp_id: employee_id,
        };
      }
      let leave = await Leave.find(leavequery)
        .populate({
          path: "emp_id",
          select: "emp_fullname _id email emp_depid emp_attadance",
          populate: {
            path: "emp_depid",
            match,
            select: "_id dep_name dep_workshift",
          },
        })
        .populate({
          path: "empleave_type_id",
        });

      const overtime = await Overtime.find(overtimequery)
        .populate({
          path: "emp_id",
          select: "emp_fullname _id email emp_depid emp_attadance",
          populate: {
            path: "emp_depid",
            match,
            select: "_id dep_name dep_workshift",
          },
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
        });

      const outside = await Outside.find(outsidequery)
        .populate({
          path: "emp_id",
          select: "emp_fullname _id email",
          populate: {
            path: "emp_depid",
            match,
            select: "_id dep_name dep_workshift",
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

      const offday = await ChangeOffDay.find(offday_query)
        .populate({
          path: "emp_id",
          select: "emp_fullname _id email",
          populate: {
            path: "emp_depid",
            match,
            select: "_id dep_name dep_workshift",
          },
        })
        .populate({
          path: "emp_replacement",
          select: "emp_fullname _id",
        })
        .populate({
          path: "company_id",
          select: "company_name",
        })
        .populate({
          path: "offday_fsuperior.fsuperior_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        })
        .populate({
          path: "offday_ssuperior.ssuperior_id",
          select: "des_name emp_id",
          populate: {
            path: "emp_id",
            select: "emp_fullname",
          },
        });

      const workshift = await Workshift.find(empchange_query)
        .populate({
          path: "emp_id",
          select: "emp_fullname _id email",
          populate: {
            path: "emp_depid",
            match,
            select: "_id dep_name dep_workshift",
          },
        })
        .populate({
          path: "empchange_replacement",
          select: "emp_fullname _id",
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
      const payload = [
        { type: "Leave Request", data: leave },
        { type: "Overtime Request", data: overtime },
        { type: "Outside Assignment", data: outside },
        { type: "Change Offday", data: offday },
        { type: "Change Workshift", data: workshift },
      ];
      res.status(200).json(payload);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to get Need Approval" });
    }
  },
};
