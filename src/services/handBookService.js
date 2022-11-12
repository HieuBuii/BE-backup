import db from "../models/index";

const createHandBookService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.userId ||
        !inputData.name ||
        !inputData.author ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.image
      ) {
        resolve({ errCode: 1, errMessage: "Missing required parameter !!" });
      } else {
        await db.Handbook.create({
          userId: inputData.userId,
          name: inputData.name,
          author: inputData.author,
          contentHTML: inputData.contentHTML,
          contentMarkdown: inputData.contentMarkdown,
          image: inputData.image,
        });
        resolve({
          errCode: 0,
          message: "Create handbook successed !!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllHandBookService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let handbooks = await db.Handbook.findAll({
        order: [["createdAt", "DESC"]],
      });
      if (handbooks && handbooks.length > 0) {
        handbooks.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }

      resolve({
        errCode: 0,
        data: handbooks,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const editHandBookService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.name ||
        !data.author ||
        !data.image ||
        !data.contentHTML ||
        !data.contentMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!!",
        });
      } else {
        let handbook = await db.Handbook.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (handbook) {
          handbook.name = data.name;
          handbook.author = data.author;
          handbook.image = data.image;
          handbook.contentHTML = data.contentHTML;
          handbook.contentMarkdown = data.contentMarkdown;

          await handbook.save();

          resolve({
            errCode: 0,
            message: "Update handbook successed!!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Handbook is not found!!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteHandBookService = (idHandbook) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idHandbook) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!!",
        });
      } else {
        let handbook = await db.Handbook.findOne({
          where: { id: idHandbook },
          raw: false,
        });
        if (handbook) {
          await handbook.destroy();
          resolve({
            errCode: 0,
            message: "Delete handbook successed!!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Handbook is not found!!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getHandBookByIdService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          message: "Missing required parameter !!",
        });
      } else {
        let data = {};
        data = await db.Handbook.findOne({
          where: { id: id },
          attributes: {
            exclude: ["createdAt", "updatedAt", "image"],
          },
          raw: false,
          nest: true,
        });

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports = {
  createHandBookService,
  getAllHandBookService,
  editHandBookService,
  deleteHandBookService,
  getHandBookByIdService,
};
