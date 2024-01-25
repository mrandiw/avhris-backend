const Employment = require("../employee/model");
const OffDay = require("./model");
const { dateToday } = require("../attedance/controller");
// const Leave = require('../leave-request/model');

function getDayName(date_string) {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const date = new Date(date_string);
  const dayName = days[date.getUTCDay()];
  return dayName;
}

function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

module.exports = {
  getEmploymentOffday: async (req, res) => {
    try {
      const { id } = req.params;
      const employment = await Employment.findOne({ _id: id });
      const schedule = employment?.emp_attadance;

      const offDays = Object.entries(schedule)
        .map(([day, { off_day }]) => ({ day, off_day }))
        .filter(({ off_day }) => off_day)
        .map(({ day }) => day[0].toUpperCase() + day.slice(1));
      return res.status(200).json(offDays);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to get employment shift" });
    }
  },
  addOffDayRequest: async (req, res) => {
    try {
      const {
        emp_id,
        offday_reason,
        offday_date,
        offday_change,
        emp_replacement,
      } = req.body;
      const employement = await Employment.findOne({ _id: emp_id });
      if (
        employement?.emp_attadance[getDayName(offday_date).toLocaleLowerCase()]
          .off_day
      ) {
        const payload = {
          company_id: employement?.company_id,
          emp_id,
          emp_replacement,
          offday_reason,
          offday_date,
          offday_change,
          offday_request: dateToday(),
          offday_fsuperior: { fsuperior_id: employement?.emp_fsuperior },
          offday_ssuperior: {
            ssuperior_id: employement.emp_ssuperior
              ? employement.emp_ssuperior
              : employement?.emp_fsuperior,
          },
        };
        const offDayRequest = new OffDay(payload);
        await offDayRequest.save();
        return res
          .status(200)
          .json({ message: "Successfully added Request Offday" });
      } else {
        return res.status(422).json({
          message: `On ${getDayName(offday_date)} You Have No Holidays`,
        });
      }
    } catch (error) {
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to added Request Off day | Server Error" });
    }
  },
  editDataOffdayRequest: async (req, res) => {
    try {
      const {
        emp_id,
        offday_reason,
        offday_date,
        offday_change,
        emp_replacement,
      } = req.body;
      const employement = await Employment.findOne({ _id: emp_id });
      if (
        employement?.emp_attadance[getDayName(offday_date).toLocaleLowerCase()]
          .off_day
      ) {
        const payload = {
          company_id: employement?.company_id,
          emp_id,
          emp_replacement,
          offday_reason,
          offday_date,
          offday_change,
          offday_request: dateToday(),
        };
        const offDayRequest = await OffDay.updateOne(
          { _id: req.params.id },
          {
            $set: {
              ...payload,
            },
          }
        );
        if (offDayRequest.modifiedCount > 0) {
          return res
            .status(200)
            .json({ message: "Successfully added Request Offday" });
        } else {
          return res
            .status(500)
            .json({ message: "Failed to Edit Request Off day" });
        }
      } else {
        return res.status(422).json({
          message: `On ${getDayName(offday_date)} You Have No Holidays`,
        });
      }
    } catch (error) {
      // if (error?.message) {
      //   return res.status(500).json({ message: error.message });
      // }
      return res
        .status(500)
        .json({ message: "Failed to Edit Request Off day | Server Error" });
    }
  },
  getOffDayRequest: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      const offdayRequest = await OffDay.find({
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

      res.status(200).json(offdayRequest);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get Off Day Request" });
    }
  },
  editOffdayRequest: async (req, res) => {
    try {
      const { offday_fsuperior, offday_ssuperior, offday_hr } = req.body;
      const findOffday = await OffDay.findOne({
        _id: req.params.id,
      });
      if (offday_hr.status === "Approved") {
        // const findEmployment = await Employment({ _id: findOffday?.emp_id });
        // const employment = await Employment.updateOne(
        //   {
        //     _id: findOffday?.emp_id,
        //   },
        //   {
        //     $set: {
        //       emp_attadance: {
        //         ...findEmployment?.emp_attadance,
        //         [getDayName(findOffday?.offday_date).toLowerCase()]: {
        //           off_day: false,
        //         },
        //         [getDayName(findOffday?.offday_change).toLowerCase()]: {
        //           off_day: true,
        //         },
        //       },
        //     },
        //   }
        // );
        // if (employment.modifiedCount > 0) {
        //   await Employment.updateOne(
        //     {
        //       _id: findOffday?.emp_replacement,
        //     },
        //     {
        //       $set: {
        //         emp_attadance: {
        //           [getDayName(findOffday?.offday_change).toLowerCase()]: {
        //             off_day: false,
        //           },
        //         },
        //       },
        //     }
        //   );
        // }
        // console.log(employment);
      }
      const offdayRequest = await OffDay.updateOne(
        { _id: req.params.id },
        {
          $set: {
            offday_fsuperior: {
              ...findOffday?.offday_fsuperior,
              status: offday_fsuperior?.status,
              approved_by: offday_fsuperior?.approved_by,
              approved_date:
                findOffday?.offday_fsuperior?.status ===
                offday_fsuperior?.status
                  ? findOffday?.offday_fsuperior.approved_date
                  : offday_fsuperior?.approved_date,
              approved_hours:
                findOffday?.offday_fsuperior?.status ===
                offday_fsuperior?.status
                  ? findOffday?.offday_fsuperior?.approved_hours
                  : offday_fsuperior?.approved_hours,
            },
            offday_ssuperior: {
              ...findOffday?.offday_ssuperior,
              status: offday_ssuperior?.status,
              approved_by: offday_ssuperior?.approved_by,
              approved_date:
                findOffday?.offday_ssuperior?.status ===
                offday_ssuperior?.status
                  ? findOffday?.offday_ssuperior?.approved_date
                  : offday_ssuperior?.approved_date,
              approved_hours:
                findOffday?.offday_ssuperior?.status ===
                offday_ssuperior?.status
                  ? findOffday?.offday_ssuperior.approved_hours
                  : offday_ssuperior?.approved_hours,
            },
            offday_hr: {
              ...findOffday?.offday_hr,
              status: offday_hr?.status,
              approved_by: offday_hr?.approved_by,
              approved_date:
                findOffday?.offday_hr?.status === offday_hr?.status
                  ? findOffday?.offday_hr?.approved_date
                  : offday_hr?.approved_date,
              approved_hours:
                findOffday?.offday_hr?.status === offday_hr?.status
                  ? findOffday?.offday_hr.approved_hours
                  : offday_hr?.approved_hours,
            },
          },
        }
      );
      if (offdayRequest.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully edit status Request Off day" });
      }
      return res
        .status(422)
        .json({ message: "All Status have been up to date" });
    } catch (error) {
      // console.log(error.message);
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to added Request Off day | Server Error" });
    }
  },
  deletedOffdayRequest: async (req, res) => {
    try {
      const offdayRequest = await OffDay.deleteOne({ _id: req.params.id });
      if (offdayRequest.deletedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully deleted Request Off day" });
      } else {
        return res
          .status(500)
          .json({ message: "Failed deleted Request Off day" });
      }
    } catch (error) {
      console.log(error.message);
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed deleted Request Off day" });
    }
  },
};
