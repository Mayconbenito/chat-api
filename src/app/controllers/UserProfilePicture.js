import User from "../models/User";
import cloudinary from "cloudinary";
import { promisify } from "util";

export default {
  put: async (req, res, next) => {
    try {
      if (
        !req.file ||
        !req.file.secure_url ||
        !req.file.width ||
        !req.file.height
      ) {
        return res.status(400).json({ code: "ERROR_WHEN_UPLOADING_FILE" });
      }

      const { secure_url: secureURL, width, height } = req.file;

      let user = await User.findById(req.user.id).select("picture");

      // delete old image from cloudinary
      if (user.picture) {
        const splitedUrl = user.picture.url.split("/");
        const [imagePublicId] = splitedUrl[splitedUrl.length - 1].split(".");

        await promisify(cloudinary.v2.uploader.destroy)(
          `images/${imagePublicId}`
        );
      }

      await User.updateOne(
        { _id: req.user.id },
        { picture: { url: secureURL, width, height } }
      );

      user = await User.findById(req.user.id);

      return res.json({ user });
    } catch (err) {
      return next(err)
    }
  }
};
