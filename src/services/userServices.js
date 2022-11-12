import db from "../models/index";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import { v4 as uuidv4 } from "uuid";
import mailServices from "./mailServices";
require("dotenv").config();

const buildURLVerifyEmail = (userEmail, token) => {
  let result = `${process.env.URL_REACT}/forgot-password?token=${token}&email=${userEmail}`;
  return result;
};

let arr = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  0,
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "J",
  "K",
  "G",
  "H",
  "M",
  "N",
  "Q",
  "P",
  "R",
  "L",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "v",
  "z",
  "x",
  "X",
  "o",
  "p",
  "i",
  "u",
  "y",
];

let hashUserPassword = async (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var passwordHashed = bcrypt.hashSync(password, salt);
      resolve(passwordHashed);
    } catch (e) {
      reject(e);
    }
  });
};

let handleUserLogin = async (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExits = await checkUserEmail(email);
      if (isExits) {
        let user = await db.User.findOne({
          attributes: [
            "id",
            "email",
            "roleId",
            "password",
            "firstName",
            "lastName",
          ],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let check = bcrypt.compareSync(password, user.password);
          if (check) {
            let token = jwt.sign(
              {
                id: user.id,
                role: user.roleId,
              },
              process.env.JWT_ACCESS_KEY,
              { expiresIn: "10d" }
            );

            userData.errCode = 0;
            userData.errMessage = "OK";

            delete user.password;
            user.accessToken = token;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Password is wrong!!";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User is not found!!";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = "User is not exits. Please try other email!!";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = async (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
        if (!users) {
          resolve({});
        }
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

const createUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (!check && data.email) {
        let hashPassWord = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPassWord,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phonenumber: data.phonenumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.image,
        });
        resolve({
          errCode: 0,
          message: "OK",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Email is already in used, please try another email!!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let foundUser = await db.User.findOne({
        where: { id: userId },
        raw: false,
      });
      if (!foundUser) {
        resolve({
          errCode: 5,
          errMessage: "User is not exits!!",
        });
      }
      foundUser.destroy();

      resolve({
        errCode: 0,
        message: "Delete user is success!!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const editUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.roleId || !data.positionId || !data.gender) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!!",
        });
      } else {
        let user = await db.User.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (user) {
          user.firstName = data.firstName;
          user.lastName = data.lastName;
          user.address = data.address;
          user.phonenumber = data.phonenumber;
          user.gender = data.gender;
          user.positionId = data.positionId;
          user.roleId = data.roleId;
          if (data.image) {
            user.image = data.image;
          }

          await user.save();

          resolve({
            errCode: 0,
            message: "Update user successed!!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "User is not found!!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!!",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const postChangeUserPWService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.email ||
        !inputData.oldPassword ||
        !inputData.newPassword
      ) {
        resolve({ errCode: 1, errMessage: "Missing required parameter !!" });
      }
      let userData = {};
      let isExits = await checkUserEmail(inputData.email);
      if (isExits) {
        let user = await db.User.findOne({
          where: { email: inputData.email },
          raw: false,
        });
        if (user) {
          let check = bcrypt.compareSync(inputData.oldPassword, user.password);
          if (check) {
            let hashPassWord = await hashUserPassword(inputData.newPassword);
            user.password = hashPassWord;

            user.save();

            userData.errCode = 0;
            userData.errMessage = "OK";

            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Password is wrong!!";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User is not found!!";
        }
      } else {
        userData.errCode = 4;
        userData.errMessage = "User is not exits. Please try other email!!";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

const postForgotPWService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.email) {
        resolve({ errCode: 1, errMessage: "Missing required parameter !!" });
      }
      let user = await db.User.findOne({
        where: { email: inputData.email },
        raw: false,
      });
      if (user) {
        let token = uuidv4();
        user.token = token;
        await user.save();
        //build mail
        await mailServices.sendEmailConfirmForgotPW({
          email: inputData.email,
          firstName: user.firstName,
          link: buildURLVerifyEmail(inputData.email, token),
        });
        resolve({
          errCode: 0,
          message: "OK",
        });
      } else {
        resolve({
          errCode: 2,
          errMessage: "User not found",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const postVeryfyForgotPWService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.token || !inputData.email) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !!",
        });
      } else {
        let user = await db.User.findOne({
          where: {
            email: inputData.email,
            token: inputData.token,
          },
          raw: false,
        });
        if (user) {
          let randomPW = "";
          for (let i = 0; i < 6; i++) {
            randomPW += arr[Math.floor(Math.random() * arr.length)];
          }
          let hashPassWord = await hashUserPassword(randomPW);

          //build mail
          await mailServices.sendEmailGiveNewPW({
            email: inputData.email,
            firstName: user.firstName,
            randomPW: randomPW,
          });
          let token = uuidv4();
          user.password = hashPassWord;
          user.token = token;
          await user.save();
          resolve({
            errCode: 0,
            message: "Update user succeed!!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "user does not exits or has been actived !!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin,
  getAllUsers,
  createUser,
  deleteUser,
  editUser,
  getAllCodeService,
  postChangeUserPWService,
  postForgotPWService,
  postVeryfyForgotPWService,
};
