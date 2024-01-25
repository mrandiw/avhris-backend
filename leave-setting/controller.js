const Leave = require("./model");

function returnCompanyId(role, req) {
  return role === "Super Admin" ? req.query.company_id : req.admin.company_id;
}

exports.addLeave = (req, res) => {
  const company_id = req.query.company_id;
  const leave = new Leave({
    ...req.body,
    leave_desc: `${req.body.leave_name} (${req.body.leave_type})`,
    company_id,
  });
  leave
    .save()
    .then(() => {
      res.status(200).json({
        message: "Leave added successfully!",
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Failed to add leave" });
    });
};

exports.getLeaves = (req, res) => {
  const company_id = req.query.company_id;
  Leave.find({ company_id })
    .then((leaves) => {
      res.status(200).json(leaves);
    })
    .catch((error) => {
      res.status(500).json({ message: "Failed to get leave" });
    });
};

exports.deleteLeave = (req, res) => {
  Leave.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.json({
        message: "Leave deleted successfully!",
        leave: result,
      });
    })
    .catch((error) => {
      res.json({
        error: error.message,
      });
    });
};

exports.updateLeave = (req, res) => {
  Leave.updateOne(
    { _id: req.params.id },
    {
      $set: {
        leave_name: req.body.leave_name,
        leave_type: req.body.leave_type,
        leave_desc: `${req.body.leave_name} (${req.body.leave_type})`,
      },
    }
  )
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Leave updated successfully!",
      });
    })
    .catch((error) => {
      res.json({
        error: error.message,
      });
    });
};

exports.updateLeaveStatus = (req, res) => {
  Leave.findByIdAndUpdate(
    req.params.id,
    { leave_status: req.body.leave_status },
    { new: true }
  )
    .then((result) => {
      res.json({
        message: "Leave status updated successfully!",
        leave: result,
      });
    })
    .catch((error) => {
      res.json({
        error: error.message,
      });
    });
};
