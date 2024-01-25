const BankPayrun = require("./model");
const Payrun = require("../payrun/model");

module.exports = {
  async getBankPayrun(req, res) {
    try {
      const { company_id, periodic_id } = req.query;
      const banksPayrun = await BankPayrun.find({
        company_id: company_id,
        is_active: true,
      }).populate({
        path: "company_id"
      }).sort({ is_default: 1 });

      const banksArray = [];
      await Promise.all(
        banksPayrun.map(async (bank) => {
          let objBank = {};
          const payruns = await Payrun.find({
            company_id: bank.company_id,
            payrun_status: "Approve",
            payrun_period: periodic_id,
          });

          const total_record = payruns.length;
          let total_amount = 0;
          payruns.forEach((payrun) => {
            total_amount += payrun.payrun_net_salary;
          });
          objBank = { bank, total_record, total_amount };
          banksArray.push(objBank);
        })
      );

      return res.status(200).send({ data: banksArray });
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  async createBankPayrun(req, res) {
    try {
      const findBank = await BankPayrun.find({
        $or: [
          {
            bank_name: req.body.bank_name,
          },
          { account_number: req.body.account_number },
        ],
      });
      if (findBank.length) {
        return res.status(409).send({ message: "bank already exist" });
      }
      const payload = {
        ...req.body,
        is_active: true,
        is_default: false,
      };
      const addBank = new BankPayrun(payload);
      const result = await addBank.save();
      return res.status(201).send(result);
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
  async updateBankPayrun(req, res) {
    try {
      const bankPayrun = await BankPayrun.findById(req.params.id);
      if (!bankPayrun) {
        return res.status(404).send({ message: "Bank payruh not found" });
      }

      await BankPayrun.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: req.body,
        }
      );

      return res.status(200).send({ message: "Updated bank payrun" });
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
  async deleteBankPayrun(req, res) {
    try {
      const bankPayrun = await BankPayrun.findById(req.params.id);
      if (!bankPayrun) {
        return res.status(404).send({ message: "Bank payruh not found" });
      }

      await BankPayrun.deleteOne({ _id: req.params.id });
      return res.status(200).send({ message: "Deleted bank payrun" });
    } catch (error) {
      return res.status(500).send(error);
    }
  },
};
