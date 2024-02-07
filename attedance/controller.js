const Attendance = require("./model");
const Employment = require("../employee/model");
const Periodic = require("../periodic/model");
const moment = require("moment");
const Salary = require("../salary/model");
const Workshift = require("../workshift/model");

async function calculateAttendanceAbsent(emp) {
  try {
    const salary = await Salary.findOne({ emp_id: emp?._id });
    if (salary) {
      return (
        salary?.emp_salary / salary?.emp_working_days +
        (0.5 * salary?.emp_salary) / salary?.emp_working_days
      );
    } else {
      return 1;
    }
  } catch (error) {
    console.log(error);
  }
}

function getDayName() {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const today = new Date();
  const dayName = days[today.getDay()];
  return dayName.toLocaleLowerCase();
}
function getAMPM(time) {
  if (time === ":00") {
    return "-";
  }
  const hours = parseInt(time.split(":")[0]);
  const minutes = parseInt(time.split(":")[1]);
  if (hours < 12) {
    return `${time} AM`;
  } else {
    return `${time} PM`;
  }
}

function getTotalHours(time1, time2) {
  let moment1 = moment(time1, "hh:mm A");
  let moment2 = moment(time2, "hh:mm A");
  let duration = moment.duration(moment2.diff(moment1));
  let hours = duration.asHours();
  return hours.toFixed(2) + " hours";
}

function getTimeDifference(workShift, attendance) {
  if (!workShift || !attendance) return "Invalid input";
  let workMoment = moment(workShift, "hh:mm A");
  let attendanceMoment = moment(attendance, "hh:mm A");
  if (!workMoment.isValid() || !attendanceMoment.isValid())
    return "Invalid input";
  let duration = moment.duration(attendanceMoment.diff(workMoment));
  let minutes = Math.round(duration.asMinutes());
  return minutes;
}

function behaviorBreak(start, end) {
  if (start === "-" || end === "-") {
    return "-";
  } else {
    let startBreak = moment(`${start}`, "HH:mm A");
    let endBreak = moment(`${end}`, "HH:mm A");

    let breakDuration = moment.duration(endBreak.diff(startBreak));
    if (breakDuration.asHours() === 1) {
      return "Regular";
    } else if (breakDuration.asHours() < 1) {
      return "Early";
    } else {
      return "Late";
    }
  }
}
function behaviorAttedance(workShift, attedance) {
  const time = getTimeDifference(workShift, getAMPM(attedance));
  if (time > 59) {
    return "Very Late";
  } else if (time > 5 && time < 59) {
    return "Late";
  } else if ((time > 0 && time < 5) || (time === 0 && time < 5)) {
    return "Regular";
  } else if (time < 0) {
    return "Early";
  }
}

async function attendanceDeduction(emp_id, workShift, attedance) {
  const time = getTimeDifference(workShift, getAMPM(attedance));
  const salary = await Salary.findOne({ emp_id: emp_id });
  let deduction;
  if (time >= 5 && time <= 10) {
    deduction = (salary?.emp_salary * 0.5) / 100;
  } else if (time > 10 && time <= 20) {
    deduction = (salary?.emp_salary * 1) / 100;
  } else if (time > 20 && time <= 30) {
    deduction = (salary?.emp_salary * 1.5) / 100;
  } else if (time > 30 && time <= 40) {
    deduction = (salary?.emp_salary * 2) / 100;
  } else if (time > 40 && time <= 50) {
    deduction = (salary?.emp_salary * 2.5) / 100;
  } else if (time > 50 && time <= 60) {
    deduction = (salary?.emp_salary * 3) / 100;
  } else if (time > 60) {
    deduction = salary?.emp_salary / 25;
  }
  return deduction || 0;
}

function dateToday() {
  let currentDate = new Date();
  let formattedDate = currentDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return formattedDate;
}

function newFormatDate(date) {
  let originalDate = new Date(date);
  let month = ("0" + (originalDate.getMonth() + 1)).slice(-2);
  let day = ("0" + originalDate.getDate()).slice(-2);
  let year = originalDate.getFullYear();
  let formattedDate = month + "/" + day + "/" + year;
  return formattedDate;
}

module.exports = {
  dateToday,
  getDayName,
  addAttendance: async (req, res) => {
    try {
      const { role } = req.admin;
      const {
        clock_in,
        clock_out,
        break_in,
        break_out,
        emp_id,
        attendance_date,
        attendance_date_out,
      } = req.body;
      const company_id = req.query.company_id;
      // if (role === "App Admin" || role === "Super Admin") {
      const findEmployment = await Employment.findOne({
        _id: emp_id,
      }).populate({
        path: `emp_attadance.${[getDayName()]}.shift`,
      });
      if (!findEmployment?.emp_attadance[getDayName()]?.shift) {
        return res.status(422).json({
          message:
            "Can't add attendance because this employment doesn't have a shift",
        });
      }
      const attendanceToday = await Attendance.findOne({
        emp_id: emp_id,
        attendance_date: newFormatDate(attendance_date),
      });
      if (attendanceToday) {
        return res
          .status(422)
          .json({ message: "This employment has been absent today" });
      }
      const employmentShiftToday = findEmployment.emp_attadance[getDayName()];
      if (employmentShiftToday.off_day) {
        return res
          .status(422)
          .json({ message: "This employment today is off" });
      }

      const payload = {
        company_id,
        emp_id: emp_id,
        insert_databy: "Has_Attendance",
        shift_id: employmentShiftToday?.shift?._id,
        workhours_in: employmentShiftToday?.shift?.shift_clockin,
        workhours_out: employmentShiftToday?.shift?.shift_clockout,
        clock_in: getAMPM(clock_in),
        clock_out: getAMPM(clock_out),
        break_in: getAMPM(break_in),
        break_out: getAMPM(break_out),
        attendance_date: newFormatDate(attendance_date),
        attendance_date_out: newFormatDate(attendance_date_out),
        workhours: getTotalHours(
          employmentShiftToday?.shift?.shift_clockin,
          employmentShiftToday?.shift?.shift_clockout
        ),
        behavior_break: behaviorBreak(getAMPM(break_in), getAMPM(break_out)),
        count_lateduration: getTimeDifference(
          employmentShiftToday?.shift?.shift_clockin,
          getAMPM(clock_in)
        ),
        attendance_status: "Attendance",
        type: "manual",
        behavior_at: behaviorAttedance(
          employmentShiftToday?.shift?.shift_clockin,
          getAMPM(clock_in)
        ),
        delay_deduction: await attendanceDeduction(
          emp_id,
          employmentShiftToday?.shift?.shift_clockin,
          getAMPM(clock_in)
        ),
        attendance_deduction: 0,
      };
      const attendance = new Attendance(payload);
      await attendance.save(async () => {
        const updateStatusAttandance = await Employment.updateOne(
          { _id: emp_id },
          {
            $set: {
              emp_attadance_status: "Attendance",
            },
          }
        );
      });
      return res
        .status(200)
        .json({ message: "Succesfully add new attendance" });
      // res.status(500).json({ message: "Failed to add new attendance" });
      // }
    } catch (error) {
      res.status(500).json({ message: "Failed to add new attendance" });
    }
  },
  getAttendance: async (req, res) => {
    try {
      const attendance_date = newFormatDate(req.query.request_date);
      const company_id = req.query.company_id;
      const periodic_id = req.query.periodic_id;
      const employee_id = req.query.employee_id;

      let filterObj = { company_id };
      if (periodic_id) {
        const periods = await Periodic.find({
          _id: periodic_id,
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

        filterObj = {
          ...filterObj,
          attendance_date: { $in: formateRanges },
        };
      }

      if (req.query.request_date) {
        filterObj = { ...filterObj, attendance_date };
      }

      if (employee_id) {
        filterObj = { ...filterObj, emp_id: employee_id };
      }

      const attendance = await Attendance.find(filterObj)
        .populate({
          path: "shift_id",
          select: "shift_name shift_desc",
        })
        .populate({
          path: "emp_id",
          select: "emp_fullname emp_depid",
          populate: {
            path: "emp_depid",
            select: "dep_name",
          },
        });
      res.status(200).json(attendance);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to get attendance" });
    }
  },
  editAttendance: async (req, res) => {
    try {
      const {
        clock_in,
        clock_out,
        break_in,
        break_out,
        emp_id,
        attendance_status,
        shift_id,
        attendance_reason,
      } = req.body;
      if (attendance_status === "Attendance") {
        if (shift_id) {
          const workshift = await Workshift.findOne({ _id: shift_id });
          const payload = {
            clock_in: getAMPM(clock_in),
            clock_out: getAMPM(clock_out),
            break_in: getAMPM(break_in),
            break_out: getAMPM(break_out),
            behavior_break: behaviorBreak(
              getAMPM(break_in),
              getAMPM(break_out)
            ),
            count_lateduration: getTimeDifference(
              workshift?.shift_clockin,
              getAMPM(clock_in)
            ),
            attendance_status: "Attendance",
            behavior_at: behaviorAttedance(
              workshift?.shift_clockin,
              getAMPM(clock_in)
            ),
            attendance_deduction: await attendanceDeduction(
              emp_id,
              workshift?.shift_clockin,
              getAMPM(clock_in)
            ),
            shift_id,
            attendance_reason,
            type: "Manual",
          };
          const attendance = await Attendance.updateOne(
            { _id: req.params.id },
            {
              $set: {
                ...payload,
              },
            }
          );
          if (attendance?.modifiedCount > 0) {
            return res
              .status(200)
              .json({ message: "Succesfully add new attendance" });
          }
        } else {
          const findEmployment = await Employment.findOne({
            _id: emp_id,
          }).populate({
            path: `emp_attadance.${[getDayName()]}.shift`,
          });

          let employmentShiftToday = findEmployment.emp_attadance[getDayName()];
          const payload = {
            clock_in: getAMPM(clock_in),
            clock_out: getAMPM(clock_out),
            break_in: getAMPM(break_in),
            break_out: getAMPM(break_out),
            behavior_break: behaviorBreak(
              getAMPM(break_in),
              getAMPM(break_out)
            ),
            count_lateduration: getTimeDifference(
              employmentShiftToday?.shift?.shift_clockin,
              getAMPM(clock_in)
            ),
            attendance_status: "Attendance",
            behavior_at: behaviorAttedance(
              employmentShiftToday?.shift?.shift_clockin,
              getAMPM(clock_in)
            ),
            attendance_deduction: await attendanceDeduction(
              emp_id,
              employmentShiftToday?.shift?.shift_clockin,
              getAMPM(clock_in)
            ),
            attendance_reason,
            type: "Manual",
          };
          const attendance = await Attendance.updateOne(
            { _id: req.params.id },
            {
              $set: {
                ...payload,
              },
            }
          );
          if (attendance?.modifiedCount > 0) {
            return res
              .status(200)
              .json({ message: "Succesfully add new attendance" });
          }
        }
      } else {
        const findEmployment = await Employment.findOne({
          _id: emp_id,
        }).populate({
          path: `emp_attadance.${[getDayName()]}.shift`,
        });
        const payload = {
          clock_in: "-",
          clock_out: "-",
          break_in: "-",
          break_out: "-",
          behavior_break: "-",
          count_lateduration: 0,
          attendance_status: attendance_status,
          behavior_at: "-",
          attendance_deduction:
            attendance_status === "Absent"
              ? await calculateAttendanceAbsent(findEmployment)
              : 0,
          attendance_reason: attendance_reason,
          shift_id: shift_id,
          type: "Manual",
        };
        const attendance = await Attendance.updateOne(
          { _id: req.params.id },
          {
            $set: {
              ...payload,
            },
          }
        );
        if (attendance?.modifiedCount > 0) {
          return res
            .status(200)
            .json({ message: "Succesfully add new attendance" });
        }
      }
      return res
        .status(422)
        .json({ message: "Opps No field change, Please try again!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to edit attendance" });
    }
  },
  deleteAttendance: async (req, res) => {
    try {
      const { id } = req.params;
      const deleteAttendance = await Attendance.deleteOne({ _id: id });
      if (deleteAttendance.deletedCount > 0) {
        return res
          .status(200)
          .json({ message: "Succesfully deleted attendance" });
      }
      return res
        .status(422)
        .json({ message: "Failed delete attendance | try again" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed delete attendance | try again" });
    }
  },
};
