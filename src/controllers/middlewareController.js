import jwt from "jsonwebtoken";
require("dotenv").config();

const middlewareController = {
  //verifyToken
  verifyToken: (req, res, next) => {
    const token = req.headers["authorization"];
    const accessToken = token.split(" ")[1];
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json("Token is not valid !!");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You are not authenticated !!");
    }
  },

  verifyTokenAdmin: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      // req.user.id === req.params.id ||
      if (req.user && req.user.role === "R1") {
        next();
      } else {
        res.status(403).json("You are not allowed to do that");
      }
    });
  },

  // verifyTokenDoctor: (req, res, next) => {
  //   middlewareController.verifyToken(req, res, () => {
  //     if (req.user.id == req.params.id || req.user.role === "R2") {
  //       next();
  //     } else {
  //       res.status(403).json("You are not allowed to do that");
  //     }
  //   });
  // },
};

module.exports = middlewareController;
