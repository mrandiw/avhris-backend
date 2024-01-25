const AllowDeduct = require("./model");

module.exports = {
  addAllowDeduct: async (req, res) => {
    const { ad_name, ad_desc, ad_type } = req.body;
    try {
      const company_id = req.query.company_id;
      // if (role === "Super Admin" || role === "App Admin") {
      const allowDeduct = new AllowDeduct({
        ad_name,
        ad_desc,
        ad_type,
        company_id,
      });
      await allowDeduct.save();
      return res.status(200).json({ message: `Successfully added ${ad_type}` });
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `Failed to Add new ${ad_type}` });
    }
  },
  editAllowDeduct: async (req, res) => {
    try {
      const { ad_name, ad_desc, ad_type } = req.body;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      await AllowDeduct.updateOne(
        { _id: id },
        {
          $set: {
            ad_name,
            ad_desc,
            ad_type,
          },
        }
      );
      return res
        .status(200)
        .json({ message: `Successfully updated ${ad_type}` });
      // }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `Failed to edit` });
    }
  },
  getAllowDeduct: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      const allowDeduct = await AllowDeduct.find({
        company_id,
      });
      res.status(200).json(allowDeduct);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  deleteAllowDeduct: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      const allowDeduct = await AllowDeduct.deleteOne({ _id: id });
      if (allowDeduct.deletedCount > 0) {
        return res.status(200).json({ message: "Successfully deleted" });
      } else {
        return res.status(422).json({ message: "Failed To Delete" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to deleted | Server Error" });
    }
  },
  changeStatusAllowDeduct: async (req, res) => {
    try {
      const { role } = req.admin;
      const { id } = req.params;
      // if (role === "Super Admin" || role === "App Admin") {
      const findAllowDeduct = await AllowDeduct.findOne({ _id: id });
      const allowDeduct = await AllowDeduct.updateOne(
        { _id: id },
        {
          $set: {
            ad_status: findAllowDeduct.ad_status ? false : true,
          },
        }
      );
      return res.status(200).json({
        message: `Successfully updated status ${findAllowDeduct.ad_type}`,
      });
      // }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: `Failed to edit status | Internal Server Error` });
    }
  },
};
