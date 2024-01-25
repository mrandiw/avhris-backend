const Periodic = require("./model");

const moment = require("moment");
module.exports = {
  addNewPeriodic: async (req, res) => {
    try {
      const {
        periodic_years,
        periodic_month,
        periodic_start_date,
        periodic_end_date,
      } = req.body;
      const { role } = req.admin;
      const company_id = req.query.company_id;
      const periodic = new Periodic({
        company_id,
        periodic_end_date,
        periodic_month,
        periodic_start_date,
        periodic_years,
      });
      await periodic.save();
      return res.status(200).json({ message: "Successfuly add new Periodic" });
    } catch (error) {
      if (error?.message) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Failed to added periodic | Server Error" });
    }
  },
  getPeriodic: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      const periodics = await Periodic.find({
        company_id,
      }).populate({
        path: "company_id",
        select: "company_name",
      });

      res.status(200).json(periodics);
      // }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to get periodic | Server Error" });
    }
  },
  async getPeriodicAttendace(req, res) {
    try {
      const { company_id, periodic_id } = req.query;
      const periodics = await Periodic.findOne({
        _id: periodic_id,
        company_id,
        periodic_status: true,
      }).populate({
        path: "company_id",
        select: "company_name",
      });
      const startDate = moment(periodics?.periodic_start_date);
      const endDate = moment(periodics?.periodic_end_date);
      const diff = endDate.diff(startDate, "days") + 1;
      const ranges = [];
      for (let i = 0; i < diff; i++) {
        ranges.push(moment(startDate).add(i, "days"));
      }
      const formateRanges = ranges.map((range) =>
        moment(range).format("YYYY-MM-DD")
      );
      return res.status(200).send({ data: formateRanges });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  editStatus: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      // if (req.admin.role === "Super Admin" || req.admin.role === "App Admin") {
      const findPeriodic = await Periodic.findOne({ _id: id });
      const company_id = req.query.company_id;
      console.log(company_id);
      const all_objs = await Periodic.updateMany(
        { company_id },
        { $set: { periodic_status: false } }
      );
      const periodic = await Periodic.updateOne(
        { _id: id },
        {
          $set: {
            periodic_status: findPeriodic.status ? false : true,
          },
        }
      );
      if (periodic.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfuly edited status periodic" });
      } else {
        return res
          .status(200)
          .json({ message: "Failed to edited status periodic" });
      }
      // }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to get periodic | Server Error" });
    }
  },
  editPeriodic: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      const {
        periodic_years,
        periodic_month,
        periodic_start_date,
        periodic_end_date,
      } = req.body;
      // if (req.admin.role === "Super Admin" || req.admin.role === "App Admin") {
      const periodic = await Periodic.updateOne(
        { _id: id },
        {
          $set: {
            periodic_years,
            periodic_month,
            periodic_start_date,
            periodic_end_date,
          },
        }
      );
      if (periodic.modifiedCount > 0) {
        return res.status(200).json({ message: "Successfuly edited periodic" });
      } else {
        return res.status(200).json({ message: "Failed to edited periodic" });
      }
      // }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to get periodic | Server Error" });
    }
  },
  deletePeriodic: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      // if (req.admin.role === "Super Admin" || req.admin.role === "App Admin") {
      const periodic = await Periodic.deleteOne({ _id: id });
      if (periodic.deletedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfuly deleted periodic" });
      } else {
        return res.status(400).json({ message: "Failed to deleted periodic" });
      }
      // }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to deleted periodic | Server Error" });
    }
  },
  getPeriodicActive: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      // if (req.admin.role === "Super Admin" || req.admin.role === "App Admin") {
      const periodic = await Periodic.findOne({
        company_id,
        periodic_status: true,
      });
      // console.log(periodic);
      res.status(200).json(periodic);
      // }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to get periodic | Server Error" });
    }
  },
};
