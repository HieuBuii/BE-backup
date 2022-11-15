import db from "../models/index";

const createClinicService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.name ||
        !inputData.address ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.image
      ) {
        resolve({ errCode: 1, errMessage: "Missing required parameter !!" });
      } else {
        await db.Clinic.create({
          name: inputData.name,
          address: inputData.address,
          contentHTML: inputData.contentHTML,
          contentMarkdown: inputData.contentMarkdown,
          image: inputData.image,
        });
        resolve({
          errCode: 0,
          message: "Create clinic successed !!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllClinicService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinics = await db.Clinic.findAll({ order: [["createdAt", "DESC"]] });
      if (clinics && clinics.length > 0) {
        clinics.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }

      resolve({
        errCode: 0,
        data: clinics,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const editClinicService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.name ||
        !data.address ||
        !data.image ||
        !data.contentHTML ||
        !data.contentMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!!",
        });
      } else {
        let clinic = await db.Clinic.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (clinic) {
          clinic.name = data.name;
          clinic.address = data.address;
          clinic.image = data.image;
          clinic.contentHTML = data.contentHTML;
          clinic.contentMarkdown = data.contentMarkdown;

          await clinic.save();

          resolve({
            errCode: 0,
            message: "Update clinic successed!!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Clinic is not found!!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteClinicService = (idClinic) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idClinic) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!!",
        });
      } else {
        let clinic = await db.Clinic.findOne({
          where: { id: idClinic },
          raw: false,
        });
        if (clinic) {
          await clinic.destroy();
          resolve({
            errCode: 0,
            message: "Delete clinic successed!!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Clinic is not found!!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getClinicByIdService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          message: "Missing required parameter !!",
        });
      } else {
        let data = {};
        data = await db.Clinic.findAll({
          where: { id: id },
          attributes: {
            exclude: ["createdAt", "updatedAt", "image"],
          },
          include: [
            {
              model: db.Doctor_Info,
              as: "doctorClinicData",
              attributes: ["doctorId"],
              include: [
                {
                  model: db.Specialty,
                  as: "doctorInfoData",
                  attributes: ["id", "nameVi", "nameEn"],
                },
              ],
            },
          ],
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
  createClinicService,
  getAllClinicService,
  editClinicService,
  deleteClinicService,
  getClinicByIdService,
};
