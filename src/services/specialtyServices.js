import db from "../models/index";

const createSpecialtyService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.nameVi ||
        !inputData.nameEn ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.image
      ) {
        resolve({ errCode: 1, errMessage: "Missing required parameter !!" });
      } else {
        await db.Specialty.create({
          nameVi: inputData.nameVi,
          nameEn: inputData.nameEn,
          contentHTML: inputData.contentHTML,
          contentMarkdown: inputData.contentMarkdown,
          image: inputData.image,
        });
        resolve({
          errCode: 0,
          message: "Create specialty successed !!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllSpecialyService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialties = await db.Specialty.findAll({
        order: [["createdAt", "DESC"]],
      });
      if (specialties && specialties.length > 0) {
        specialties.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }

      resolve({
        errCode: 0,
        data: specialties,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const editSpecialtyService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.nameVi ||
        !data.nameEn ||
        !data.image ||
        !data.contentHTML ||
        !data.contentMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!!",
        });
      } else {
        let specialty = await db.Specialty.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (specialty) {
          specialty.nameVi = data.nameVi;
          specialty.nameEn = data.nameEn;
          specialty.image = data.image;
          specialty.contentHTML = data.contentHTML;
          specialty.contentMarkdown = data.contentMarkdown;

          await specialty.save();

          resolve({
            errCode: 0,
            message: "Update specialty successed!!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Specialty is not found!!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteSpecialtyService = (idSpecialty) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idSpecialty) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!!",
        });
      } else {
        let specialty = await db.Specialty.findOne({
          where: { id: idSpecialty },
          raw: false,
        });
        if (specialty) {
          await specialty.destroy();
          resolve({
            errCode: 0,
            message: "Delete specialty successed!!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Specialty is not found!!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getSpecialyByIdService = (id, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !location) {
        resolve({
          errCode: 1,
          message: "Missing required parameter !!",
        });
      } else {
        let data = {};
        if (location === "ALL") {
          data = await db.Specialty.findAll({
            where: { id: id },
            attributes: ["contentHTML", "contentMarkdown"],
            include: [
              {
                model: db.Doctor_Info,
                as: "doctorInfoData",
                attributes: ["doctorId", "proviceId"],
              },
            ],
            raw: false,
            nest: true,
          });
        } else {
          data = await db.Specialty.findAll({
            where: { id: id },
            attributes: ["contentHTML", "contentMarkdown"],
            include: [
              {
                model: db.Doctor_Info,
                where: { proviceId: location },
                as: "doctorInfoData",
                attributes: ["doctorId", "proviceId"],
              },
            ],
            raw: false,
            nest: true,
          });
        }

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
  createSpecialtyService,
  getAllSpecialyService,
  editSpecialtyService,
  deleteSpecialtyService,
  getSpecialyByIdService,
};
