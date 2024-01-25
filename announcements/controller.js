const Announcement = require("./model");

function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [month, day, year].join("/");
}

module.exports = {
  addAnnouncement: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      const announcement = new Announcement({
        company_id,
        ...req.body,
        announcement_created: formatDate(new Date()),
      });
      await announcement.save();
      return res
        .status(200)
        .json({ message: "Successfully added announcement" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Failed added announcement | Server Error" });
    }
  },
  EditAnnouncement: async (req, res) => {
    try {
      const announcement = await Announcement.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: {
            ...req.body,
          },
        }
      );
      if (announcement.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully added announcement" });
      } else {
        return res.status(422).json({ message: "No data changed" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Failed edited announcement | Server Error" });
    }
  },
  deleteAnnouncement: async (req, res) => {
    try {
      const announcement = await Announcement.deleteOne({
        _id: req.params.id,
      });
      if (announcement.deletedCount > 0) {
        return res
          .status(200)
          .json({ message: "Successfully deleted announcement" });
      } else {
        return res.status(422).json({ message: "Failed deleted announcement" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Failed deleted announcement | Server Error" });
    }
  },
  getAnnouncement: async (req, res) => {
    try {
      const company_id = req.query.company_id;
      const announcement = await Announcement.find({
        company_id,
      }).populate({
        path: "announcement_depid",
        select: "dep_name",
      });
      return res.status(200).json(announcement);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed added announcement | Server Error" });
    }
  },
};
