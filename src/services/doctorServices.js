import db from "../models/index";
import _ from "lodash";
import mailServices from "./mailServices";

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const getTopDoctorService = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limit,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueVi", "valueEn"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueVi", "valueEn"],
          },
        ],
        raw: true,
        nest: true,
      });

      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllDoctorsService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctocs = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({ errCode: 0, data: doctocs });
    } catch (e) {
      reject(e);
    }
  });
};

const saveInfoDoctorService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.description ||
        !inputData.priceId ||
        !inputData.paymentId ||
        !inputData.proviceId ||
        // !inputData.nameClinic ||
        // !inputData.addressClinic ||
        !inputData.note ||
        !inputData.specialtyId ||
        !inputData.clinicId
      ) {
        resolve({ errCode: 1, errMessage: "Missing required parameter !!" });
      } else {
        let doctor = await db.Doctor_Intro.findOne({
          where: { doctorId: inputData.doctorId },
          raw: false,
        });
        //markdown
        if (!doctor) {
          await db.Doctor_Intro.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else {
          (doctor.contentHTML = inputData.contentHTML),
            (doctor.contentMarkdown = inputData.contentMarkdown),
            (doctor.description = inputData.description),
            await doctor.save();
        }
        //info-doctor
        let infoDoctor = await db.Doctor_Info.findOne({
          where: { doctorId: inputData.doctorId },
          raw: false,
        });
        if (!infoDoctor) {
          //create
          await db.Doctor_Info.create({
            doctorId: inputData.doctorId,
            priceId: inputData.priceId,
            paymentId: inputData.paymentId,
            proviceId: inputData.proviceId,
            // nameClinic: inputData.nameClinic,
            // addressClinic: inputData.addressClinic,
            note: inputData.note,
            clinicId: inputData.clinicId,
            specialtyId: inputData.specialtyId,
          });
        } else {
          //update
          (infoDoctor.priceId = inputData.priceId),
            (infoDoctor.paymentId = inputData.paymentId),
            (infoDoctor.proviceId = inputData.proviceId),
            // (infoDoctor.nameClinic = inputData.nameClinic),
            // (infoDoctor.addressClinic = inputData.addressClinic),
            (infoDoctor.note = inputData.note),
            (infoDoctor.clinicId = inputData.clinicId),
            (infoDoctor.specialtyId = inputData.specialtyId);
          await infoDoctor.save();
        }
        resolve({
          errCode: 0,
          message: "Create doctor's info successed !!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getInfoDoctorService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          message: "Missing required parameter !!",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: id },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.Doctor_Intro,
              attributes: ["description", "contentMarkdown", "contentHTML"],
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Clinic,
                  as: "doctorClinicData",
                  attributes: ["name", "address"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (data && data.image) {
          data.image = Buffer.from(data.image, "base64").toString("binary");
        }
        if (!data) data = {};

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

const saveCreateScheduleService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formatDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !!",
        });
      } else {
        let schedule = data.arrSchedule;

        let isExits = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formatDate },
          attributes: ["timeType", "date", "doctorId"],
        });

        let toCreate = _.differenceWith(schedule, isExits, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }

        resolve({
          errCode: 0,
          message: "OK!!",
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const getScheduleDoctorService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !!",
        });
      } else {
        let data = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) {
          data = [];
        }
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getExtraDoctorInfoService = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !!",
        });
      } else {
        let data = await db.Doctor_Info.findOne({
          where: {
            doctorId: doctorId,
          },
          include: [
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.Allcode,
              as: "paymentTypeData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.Allcode,
              as: "provinceTypeData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.Clinic,
              as: "doctorClinicData",
              attributes: ["name", "address"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) {
          data = [];
        }
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteScheduleDoctorService = (idSchedule) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idSchedule) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!!",
        });
      } else {
        let schedule = await db.Schedule.findOne({
          where: { id: idSchedule },
          raw: false,
        });
        if (schedule) {
          await schedule.destroy();
          resolve({
            errCode: 0,
            message: "Delete schedule successed!!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Schedule is not found!!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAppointmentDoctorService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !!",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            doctorId: doctorId,
            date: date,
            statusId: "S2",
          },
          include: [
            {
              model: db.User,
              as: "bookingData",
              attributes: [
                "firstName",
                "phonenumber",
                "address",
                "gender",
                "email",
              ],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueVi", "valueEn"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeBookingData",
              attributes: ["valueVi", "valueEn"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) {
          data = [];
        }
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getHistoryDoctorService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !!",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            doctorId: doctorId,
            date: date,
            statusId: { [Op.or]: ["S3", "S4"] },
          },
          attributes: {
            exclude: ["image"],
          },
          include: [
            {
              model: db.User,
              as: "bookingData",
              attributes: [
                "firstName",
                "phonenumber",
                "address",
                "gender",
                "email",
              ],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueVi", "valueEn"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeBookingData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.Allcode,
              as: "statusData",
              attributes: ["valueVi", "valueEn"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) {
          data = [];
        }
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const sendMailToCusService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.patientId ||
        !data.fullNamePatient ||
        !data.dateAppointment ||
        !data.timeAppointment ||
        !data.date ||
        !data.timeType
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !!",
        });
      } else {
        let doctor = await db.User.findOne({
          where: { id: data.doctorId },
          attributes: ["firstName", "lastName"],
        });
        if (doctor) {
          await mailServices.sendEmailToCustomer({
            email: data.email,
            nameDoctor: `${doctor.lastName} ${doctor.firstName}`,
            fullNamePatient: data.fullNamePatient,
            dateAppointment: data.dateAppointment,
            timeAppointment: data.timeAppointment,
            file: data.bill,
            message: data.message,
          });
          let booking = await db.Booking.findOne({
            where: {
              doctorId: data.doctorId,
              patientId: data.patientId,
              date: data.date,
              timeType: data.timeType,
            },
            raw: false,
          });
          if (booking) {
            (booking.image = data.bill), await booking.save();
          }
          resolve({
            errCode: 0,
            message: "OK!!",
          });
        } else {
          resolve({
            errCode: 2,
            message: "User is not found !!",
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const confirmAppointmentSucceedService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.doctorId || !data.date || !data.timeType || !data.patientId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !!",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            date: data.date,
            timeType: data.timeType,
          },
          raw: false,
        });
        if (appointment) {
          (appointment.statusId = "S3"), await appointment.save();
          resolve({
            errCode: 0,
            message: "OK!!",
          });
        } else {
          resolve({
            errCode: 2,
            message: "User is not found !!",
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const cancelAppointmentService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.doctorId || !data.date || !data.timeType || !data.patientId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !!",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            date: data.date,
            timeType: data.timeType,
          },
          raw: false,
        });
        if (appointment) {
          (appointment.statusId = "S4"), await appointment.save();
          resolve({
            errCode: 0,
            message: "OK!!",
          });
        } else {
          resolve({
            errCode: 2,
            message: "User is not found !!",
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports = {
  getTopDoctorService,
  getAllDoctorsService,
  saveInfoDoctorService,
  getInfoDoctorService,
  saveCreateScheduleService,
  getScheduleDoctorService,
  getExtraDoctorInfoService,
  deleteScheduleDoctorService,
  getAppointmentDoctorService,
  sendMailToCusService,
  confirmAppointmentSucceedService,
  cancelAppointmentService,
  getHistoryDoctorService,
};
