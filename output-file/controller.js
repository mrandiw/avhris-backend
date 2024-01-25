const OutputFile = require("./model");

module.exports = {
  async getOutputFile(req, res) {
    try {
      const outputFiles = await OutputFile.find();
      return res.status(200).send({ data: outputFiles });
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  async addOutputFile(req, res) {
    try {
      const outputFile = new OutputFile(req.body);
      const result = await outputFile.save();
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
  async updateOutputFile(req, res) {
    try {
      const outputFile = await OutputFile.findById(req.params.id);
      if (!outputFile) {
        return res.status(404).send({ message: "Ouput file not found" });
      }

      await OutputFile.updateOne(
        {
          _id: req.params.id,
        },
        { $set: req.body }
      );

      return res.status(200).send({ message: "Updated output file" });
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
  async deleteOutputFile(req, res) {
    try {
      const outputFile = await OutputFile.findById(req.params.id);

      if (!outputFile) {
        return res.status(404).send({ message: "Output file not found" });
      }

      await OutputFile.deleteOne({ _id: req.params.id });

      return res.status(200).send({ message: "Deleted output file" });
    } catch (error) {
      return res.status(500).send(error);
    }
  },
};
