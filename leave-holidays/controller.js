const LeaveHoliday = require("./model");

module.exports = {
  addNewLeaveHoliday: async (req, res) => {
    try {
      const {
        leavehol_startdate,
        leavehol_enddate,
        leavehol_desc,
        leavehol_type,
        leavehol_cutleave,
        leavehol_depid,
      } = req.body;
      const company_id = req.query.company_id;
      // if (role === "Super Admin" || role === "App Admin") {
      const leaveHol = new LeaveHoliday({
        company_id,
        leavehol_startdate,
        leavehol_enddate,
        leavehol_desc,
        leavehol_type,
        leavehol_cutleave,
        leavehol_depid,
      });
      await leaveHol.save();
      const typeLeaveHole =
        leavehol_type === "Cuti Bersama" ? "Joint Leave" : "National Holiday";
      res
        .status(200)
        .json({ message: `Succesfully added new ${typeLeaveHole}` });
      // }
    } catch (error) {
      console.log(error);
    }
  },
  editLeaveHoliday: async (req, res) => {
    try {
      const {
        leavehol_startdate,
        leavehol_enddate,
        leavehol_desc,
        leavehol_type,
        leavehol_cutleave,
        leavehol_depid,
      } = req.body;
      const company_id = req.query.company_id;
      // if (role === "Super Admin" || role === "App Admin") {
      const leaveHol = await LeaveHoliday.updateOne(
        { _id: req.params.id },
        {
          $set: {
            leavehol_startdate,
            leavehol_enddate,
            leavehol_desc,
            leavehol_type,
            leavehol_cutleave,
            leavehol_depid: leavehol_depid,
          },
        }
      );
      if (leaveHol.modifiedCount > 0) {
        const typeLeaveHole =
          leavehol_type === "Cuti Bersama" ? "Joint Leave" : "National Holiday";
        return res
          .status(200)
          .json({ message: `Succesfully edited ${typeLeaveHole}` });
      } else {
        return res
          .status(500)
          .json({ message: `Failed edited ${typeLeaveHole}` });
      }
      // }
    } catch (error) {
      return res.status(500).json({ message: `Failed edited Leave Holiday` });
    }
  },
  deleteLeaveHoliday: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      // if (role === "Super Admin" || role === "App Admin") {
      console.log(req.params.id);
      const leaveHol = await LeaveHoliday.deleteOne({ _id: req.params.id });
      if (leaveHol.deletedCount > 0) {
        return res
          .status(200)
          .json({ message: `Succesfully deleted Leave Holiday` });
      } else {
        return res
          .status(500)
          .json({ message: `Failed deleted Leave Holiday` });
      }
      // }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: `Failed deleted Leave Holiday` });
    }
  },
  getLeaveHoliday: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      // if (role === "Super Admin" || role === "App Admin") {
      const leaveHol = await LeaveHoliday.find({
        company_id,
      }).populate({
        path: "leavehol_depid",
        select: "_id dep_name",
      });
      res.status(200).json(leaveHol);
      // }
    } catch (error) {
      console.log(error);
    }
  },
};
