import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let creatNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassWord = hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPassWord,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

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

let getUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let editUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  });
};

let putUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phonenumber = data.phonenumber;

        await user.save();

        let users = await db.User.findAll({
          raw: true,
        });
        resolve(users);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUserCRUD = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (user) {
        await user.destroy();
        let users = await db.User.findAll({
          raw: true,
        });
        resolve(users);
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  creatNewUser: creatNewUser,
  getUser: getUser,
  editUser: editUser,
  putUser: putUser,
  deleteUserCRUD: deleteUserCRUD,
};
