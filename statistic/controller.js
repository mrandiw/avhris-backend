const Employee = require("../employee/model");
const Attendance = require("../attedance/model");
const LeaveRequest = require("../leave-request/model");
const Periodic = require("../periodic/model");
const moment = require("moment");

module.exports = {
  async getAttendanceAndLeaveStatistic(req, res) {
    try {
      const {
        company_id,
        off_today,
        leave_request,
        by_absent,
        by_late,
        leave_today,
      } = req.query;

      const periods = await Periodic.find({
        company_id,
        periodic_status: true,
      });

      const startDate = moment(periods[0].periodic_start_date);
      const endDate = moment(periods[0].periodic_end_date);
      const diff = endDate.diff(startDate, "days") + 1;
      const ranges = [];
      for (let i = 0; i < diff; i++) {
        ranges.push(moment(startDate).add(i, "days"));
      }
      const formateRanges = ranges.map((range) =>
        moment(range).format("MM/DD/YYYY")
      );

      const pageNumber = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 5;
      let startIndex = (pageNumber - 1) * limit;
      const endIndex = (pageNumber + 1) * limit;
      let meta = {};
      let employeeStatistics = [];
      if (by_late) {
        const count = await Attendance.find({
          company_id,
          behavior_at: "Late",
          attendance_date: { $in: formateRanges },
        }).countDocuments();

        const find = {
          company_id,
          behavior_at: "Late",
          attendance_date: { $in: formateRanges },
        };

        const employeeAttendances = await Attendance.find(find).populate({
          path: "emp_id",
          select: "emp_fullname _id emp_depid",
          populate: {
            path: "emp_depid",
            select: "dep_name",
          },
        });

        employeeStatistics = await Promise.all(
          employeeAttendances.map(async (employee) => {
            const attendances = await Attendance.find({
              ...find,
              emp_id: employee.emp_id._id,
              attendance_date: { $in: formateRanges },
            }).countDocuments();

            return {
              employee: employee.emp_id,
              total: attendances,
            };
          })
        );

        employeeStatistics = employeeStatistics.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.employee._id === value.employee._id &&
                t.employee.emp_fullname === value.employee.emp_fullname
            )
        );
        meta = {
          total: count,
          totalPages: Math.ceil((count / limit) * 1),
          currentPage: pageNumber,
        };
      }

      if (by_absent) {
        const findAttendance = {
          company_id,
          attendance_status: "Absent",
        };
        const count = await Attendance.find({
          ...findAttendance,
          attendance_date: { $in: formateRanges },
        }).countDocuments();

        const employeeAttendances = await Attendance.find(
          findAttendance
        ).populate({
          path: "emp_id",
          select: "emp_fullname _id emp_depid",
          populate: {
            path: "emp_depid",
            select: "dep_name",
          },
        });

        employeeStatistics = await Promise.all(
          employeeAttendances.map(async (employee) => {
            if (employee.emp_id) {
              const attendances = await Attendance.find({
                ...findAttendance,
                emp_id: employee.emp_id._id,
                attendance_date: { $in: formateRanges },
              }).countDocuments();
              return {
                employee: employee.emp_id,
                total: attendances,
              };
            } else {
              return {
                employee: null,
                total: null,
              };
            }
          })
        );

        const filterEmployee = employeeStatistics.filter(
          (statistic) => statistic.employee !== null
        );
        employeeStatistics = filterEmployee.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.employee._id === value.employee._id &&
                t.employee.emp_fullname === value.employee.emp_fullname
            )
        );

        meta = {
          tota: count,
          totalPages: Math.ceil((count / limit) * 1),
          currentPage: pageNumber,
        };
      }

      if (off_today) {
        const today = moment(Date.now())
          .locale("ID")
          .format("dddd")
          .toLowerCase();
        const count = await Employee.find({
          company_id,
        }).countDocuments();

        const employees = await Employee.find({
          company_id,
        }).sort("_id");

        const filterEmployee = employees.filter((employee) => {
          return employee.emp_attadance[today].off_day === true;
        });

        employeeStatistics = filterEmployee.map((employeeStatistic) => {
          return { employee: employeeStatistic, total: 1 };
        });

        meta = {
          total: employeeStatistics.length,
          totalPages: Math.ceil((count / limit) * 1),
          currentPage: pageNumber,
        };
      }

      if (leave_request) {
        const today = moment(Date.now()).format("YYYY-MM-DD");
        const count = await LeaveRequest.find({
          company_id,
          empleave_start_date: today,
        }).countDocuments();

        const attendances = await LeaveRequest.find({
          company_id,
          empleave_start_date: today,
        }).populate({
          path: "emp_id",
          select: "emp_fullname _id emp_depid",
          populate: {
            path: "emp_depid",
            select: "dep_name",
          },
        });
        meta = {
          tota: count,
          totalPages: Math.ceil((count / limit) * 1),
          currentPage: pageNumber,
        };

        employeeStatistics = attendances.map((attendance) => {
          return { employee: attendance.emp_id, total: 1 };
        });
      }

      if (leave_today) {
        const today = moment(Date.now()).format("YYYY-MM-DD");
        const count = await LeaveRequest.find({
          company_id,
          empleave_start_date: today,
          empleave_hr: {
            status: "Approved",
          },
        }).countDocuments();

        const attendances = await LeaveRequest.find({
          company_id,
          empleave_start_date: today,
          empleave_hr: {
            status: "Approved",
          },
        }).populate({
          path: "emp_id",
          select: "emp_fullname _id emp_depid",
          populate: {
            path: "emp_depid",
            select: "dep_name",
          },
        });

        meta = {
          total: count,
          totalPages: Math.ceil((count / limit) * 1),
          currentPage: pageNumber,
        };

        employeeStatistics = attendances.map((attendance) => {
          return { employee: attendance.emp_id, total: 1 };
        });
      }

      const filterEmployees = employeeStatistics.filter(
        (employee) => employee.total !== 0
      );

      const sortEmployee = filterEmployees.sort((a, b) => b.total - a.total);

      return res.status(200).send({ data: sortEmployee, meta });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
