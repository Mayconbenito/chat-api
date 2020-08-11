import generateHash from "../../helpers/crypto";
import jwt from "../../helpers/jwt";

import User from "../models/User";

export default {
  store: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const passwordHash = await generateHash(process.env.APP_KEY, password);

      const user = await User.findOne({
        email: email,
        password: passwordHash,
      }).select("-contacts +email");

      if (!user) {
        return res.status(401).json({ code: "INVALID_CREDENTIALS" });
      }

      const jwtToken = await jwt.sign({ id: user._id }, process.env.JWT_HASH);
      const wsToken = await jwt.sign(
        { id: user._id, type: "WS" },
        process.env.JWT_HASH
      );

      await User.updateOne(
        { _id: user._id },
        {
          ws: { token: wsToken, createdAt: Date.now() },
        }
      );

      res.json({ user, jwt: jwtToken, wsToken });
    } catch (err) {
      return next(err);
    }
  },
};
