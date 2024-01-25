const Bank = require("./model");

module.exports = {
  addNewBank: async (req, res) => {
    try {
      const { bi_holder_name, bi_bank_name, bi_account_number, emp_id } =
        req.body;
      const { role } = req.admin;
      // if (role === "Super Admin" || role === "App Admin") {
      const bank = new Bank({
        bi_holder_name,
        bi_bank_name,
        bi_account_number,
        emp_id,
      });
      await bank.save();
      return res.status(200).json({ message: "Successfully added new bank" });
      // } else {
      //   return res
      //     .status(422)
      //     .json({ message: "You can't add bank info to this employment" });
      // }
    } catch (error) {
      res.status(500).json({ message: "Failed to Add new bank" });
    }
  },
  editBank: async (req, res) => {
    try {
      const { bi_holder_name, bi_bank_name, bi_account_number } = req.body;
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      const bank = await Bank.updateOne(
        { _id: id },
        {
          $set: {
            bi_holder_name,
            bi_bank_name,
            bi_account_number,
          },
        }
      );
      return res.status(200).json({ message: "Successfully updated bank" });
      // } else {
      //   return res
      //     .status(422)
      //     .json({ message: "You can't updated bank this employment" });
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to edited bank" });
    }
  },
  getBank: async (req, res) => {
    try {
      const emp_id = req?.query?.emp_id;
      const { role } = req.admin;
      // if (role === "Super Admin" || role === "App Admin") {
      const bank = await Bank.find({
        emp_id,
      });
      res.status(200).json(bank);
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to Get bank" });
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      const bank = await Bank.deleteOne({ _id: id });
      if (bank.deletedCount > 0) {
        return res.status(200).json({ message: "Successfully deleted bank" });
      }
      // } else {
      //   return res
      //     .status(422)
      //     .json({ message: "You can't delete bank this employment" });
      // }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Failed to deleted bank | Server Error" });
    }
  },
};
