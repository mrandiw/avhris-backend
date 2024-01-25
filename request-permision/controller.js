const Permision = require("./model");

module.exports = {
  addPermision: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      const permision = new Permision({ ...req.body, company_id });
      await permision.save();
      return res
        .status(200)
        .json({ message: "Berhasil Menambahkan Type Permision" });
    } catch (error) {
      console.log(error);
    }
  },
};
