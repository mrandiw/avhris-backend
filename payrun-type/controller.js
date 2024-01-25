const PayrunType = require("./model");

module.exports = {
  async getPayrunType(req, res) {
    try {
      const { company_id } = req.query;
      let payrunTypes = await PayrunType.find()
        .populate({
          path: "output_file",
        })
        .sort({ createdAt: "-1" });

      if (company_id) {
        payrunTypes = await PayrunType.find({
          company_id,
        })
          .populate({
            path: "output_file",
          })
          .sort({ createdAt: "-1" });
      }
      return res.status(200).send({ data: payrunTypes });
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  async createPayrunType(req, res) {
    try {
      const findPayrunType = await PayrunType.findOne({
        payrun_type: req.body.payrun_type,
        company_id: req.body.company_id,
      });

      if (findPayrunType) {
        return res.status(409).send({ message: "payrun type already exist" });
      } else {
        const addPayrunType = new PayrunType(req.body);
        const result = await addPayrunType.save();
        return res.status(201).send(result);
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        let errors = {};
        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });

        return res.status(400).send(errors);
      }
      return res.status(500).send(error);
    }
  },
  async updatePayrunType(req, res) {
    try {
      const { id } = req.params;

      const payrunType = await PayrunType.findById(id);
      if (!payrunType) {
        return res.status(404).send({ message: "Payrun type doesn't exist" });
      }

      const checkPayrunType = await PayrunType.find({
        payrun_type: req.body.payrun_type,
        _id: id,
      });

      if (checkPayrunType.length) {
        return res.status(409).send({ message: "Payrun type already exist" });
      }

      await PayrunType.updateOne(
        { _id: id },
        {
          $set: req.body,
        }
      );
      return res.status(200).send({ message: "Updated payrun type" });
    } catch (error) {
      if (error.name === "ValidationError") {
        let errors = {};
        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });

        return res.status(400).send(errors);
      }
      return res.status(500).send(error);
    }
  },
  async deletePayrunType(req, res) {
    try {
      const { id } = req.params;

      const findPayrunType = await PayrunType.findById(id);
      if (!findPayrunType) {
        return res.status(404).send({ message: "Payrun type doesn't exist" });
      }
      await PayrunType.deleteOne({ _id: id });
      return res.status(200).send({ message: "Deleted payrun type" });
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  async setDefaultPayrunType(req, res) {
    try {
      const { id } = req.params;
      const findPayrunType = await PayrunType.findById(id);

      if (!findPayrunType) {
        return res.status(404).send({ message: "Payrun type doesn't exist" });
      }

      await PayrunType.updateOne({ _id: id }, { $set: req.body });
      return res
        .status(200)
        .send({ message: "Set default payrun type successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
