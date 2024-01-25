const Task = require("./model");

module.exports = {
  getTask: async (req, res) => {
    try {
      const { company_id, departement_id, status, employee_id, created_date } =
        req.query;
      const pageNumber = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (pageNumber - 1) * limit;
      let findObj = {};
      let filterTask = {};

      if (company_id) {
        filterTask = {
          ...filterTask,
          company_id,
        };
      }
      if (created_date) {
        const splitCreatedDate = created_date.split(",");
        filterTask = {
          ...filterTask,
          createdAt: {
            $gte: splitCreatedDate[0],
            $lt: splitCreatedDate[1],
          },
        };
      }
      if (departement_id) {
        findObj = {
          emp_depid: departement_id,
        };
      }

      if (employee_id) {
        findObj = { ...findObj, _id: employee_id };
      }

      if (status) {
        filterTask = {
          ...filterTask,
          task_status: status,
        };
      }

      const count = await Task.find(filterTask).countDocuments().exec();
      const tasks = await Task.find(filterTask)
        .populate({
          path: "task_workers",
          match: findObj,
          select: "_id emp_fullname emp_depid",
        })
        .populate({
          path: "company_id",
          select: "_id company_name",
        })
        .populate({
          path: "created_by",
          select: "role",
        })
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit * 1);

      const meta = {
        total: count,
        totalPages: Math.ceil((count / limit) * 1),
        currentPage: pageNumber,
      };
      return res.status(200).send({ data: tasks, meta: meta });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  createTask: async (req, res) => {
    try {
      const payload = {
        ...req.body,
        task_status: "not_started",
        progress: 0,
      };
      const task = new Task(payload);
      await task.save();
      return res.status(200).send({ data: task, message: "Created task" });
    } catch (error) {
      if (error.name === "ValidationError") {
        let errors = [];
        Object.keys(error.errors).forEach((key) => {
          const errorObj = {};

          errorObj[key] = error.errors[key].message;
          errors.push(errorObj);
        });

        return res.status(400).send({ errors: errors });
      }
      return res.status(500).send(error);
    }
  },
  updateTask: async (req, res) => {
    try {
      const id = req.params.id;
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).send({ message: "Task not found" });
      }

      await Task.updateOne(
        { _id: id },
        {
          $set: {
            ...req.body,
          },
        }
      );

      return res.status(200).send({ message: "Updated task" });
    } catch (error) {
      if (error.name === "ValidationError") {
        let errors = [];
        Object.keys(error.errors).forEach((key) => {
          const errorObj = {};

          errorObj[key] = error.errors[key].message;
          errors.push(errorObj);
        });

        return res.status(400).send({ errors: errors });
      }
      return res.status(500).send(error);
    }
  },
  deleteTask: async (req, res) => {
    try {
      const id = req.params.id;
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).send({ message: "Task not found" });
      }

      await Task.deleteOne({ _id: id });
      return res.status(200).send({ message: "Deleted task" });
    } catch (error) {
      return res.status(500).send(error);
    }
  },
};
