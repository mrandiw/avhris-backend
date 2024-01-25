const Lately = require("./model");

module.exports = {
  addLately: async (req, res) => {
    try {
      const { role } = req.admin;
      const updateIndicator = await Lately.updateMany(
        {
          lately_formula:
            "([Basic Salary]/[Jumlah hari kerja]) + (50% * ([Basic Salary]/[Jumlah hari kerja])",
        },
        {
          $set: {
            lately_indicator: "Absent",
          },
        }
      );
      console.log(updateIndicator);
      const company_id = req.query.company_id;
      const lately = new Lately({
        ...req.body,
        company_id,
      });
      await lately.save();
      return res.status(200).json({ message: "Successfuly add new deduction" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed add new deduction" });
    }
  },
  getLately: async (req, res) => {
    try {
      const lately = await Lately.find({
        company_id: req.query.company_id,
      });
      return res.status(200).json(lately);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed get deduction" });
    }
  },
};
