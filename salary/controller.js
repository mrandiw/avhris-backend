const Salary = require("./model");

module.exports = {
  addNewSalary: async (req, res) => {
    try {
      const {
        emp_salary,
        emp_working_hours,
        emp_working_days,
        emp_periode,
        emp_id,
      } = req.body;
      const { role } = req.admin;
      if (
        role === "Super Admin" ||
        role === "App Admin" ||
        role === "Group Admin"
      ) {
        const findSalary = await Salary.findOne({ emp_id });
        if (findSalary) {
          const salary = await Salary.updateOne(
            { emp_id },
            {
              $set: {
                emp_salary,
                emp_working_hours,
                emp_working_days,
                emp_periode,
              },
            }
          );
          return res
            .status(200)
            .json({ message: "Successfully updated salary" });
        } else {
          const salary = new Salary({
            emp_salary,
            emp_working_hours,
            emp_working_days,
            emp_periode,
            emp_id,
          });
          await salary.save();
          return res.status(200).json({ message: "Successfully added salary" });
        }
      } else {
        return res
          .status(422)
          .json({ message: "You can't add salary to this employment" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Add salary" });
    }
  },
  editSalary: async (req, res) => {
    try {
      const { emp_salary, emp_working_hours, emp_working_days, emp_periode } =
        req.body;
      const { role } = req.admin;
      const { id } = req.params;
      if (
        role === "Super Admin" ||
        role === "App Admin" ||
        role === "Group Admin"
      ) {
        const salary = await Salary.updateOne(
          { _id: id },
          {
            $set: {
              emp_salary,
              emp_working_hours,
              emp_working_days,
              emp_periode,
            },
          }
        );
        return res.status(200).json({ message: "Successfully updated salary" });
      } else {
        return res
          .status(422)
          .json({ message: "You can't updated salary this employment" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to edited salary" });
    }
  },
  getSalary: async (req, res) => {
    try {
      const emp_id = req?.query?.emp_id;
      const { role } = req.admin;
      // if (
      //   role === "Super Admin" ||
      //   role === "App Admin" ||
      //   role === "Group Admin"
      // ) {
      const salary = await Salary.findOne({
        emp_id,
      });
      if (salary) {
        res.status(200).json(salary);
      } else {
        res.status(404).json({ message: "Can't find salary" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get salary" });
    }
  },
  deleteSalary: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      if (
        role === "Super Admin" ||
        role === "App Admin" ||
        role === "Group Admin"
      ) {
        const salary = await Salary.deleteOne({ _id: id });
        if (salary.deletedCount > 0) {
          return res
            .status(200)
            .json({ message: "Successfully deleted salary" });
        }
      } else {
        return res
          .status(422)
          .json({ message: "You can't delete salary this employment" });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Failed to deleted salary | Server Error" });
    }
  },
};
