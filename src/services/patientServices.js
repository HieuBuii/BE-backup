import db from "../models/index";
require("dotenv").config();
import mailServices from "./mailServices";
import { v4 as uuidv4 } from "uuid";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const buildURLVerifyEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

const savePatientBookingService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.timeType ||
        !inputData.fullName ||
        !inputData.date ||
        !inputData.email ||
        !inputData.doctorId ||
        !inputData.phonenumber ||
        !inputData.reason ||
        !inputData.gender ||
        !inputData.address
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !!",
        });
      } else {
        //send Mail confirm

        let token = uuidv4();
        await mailServices.sendEmailConfirmBooking({
          email: inputData.email,
          fullName: inputData.fullName,
          timeString: inputData.timeString,
          doctorName: inputData.doctorName,
          link: buildURLVerifyEmail(inputData.doctorId, token),
          language: inputData.language,
        });

        let user = await db.User.findOrCreate({
          where: { email: inputData.email },
          defaults: {
            email: inputData.email,
            roleId: "R3",
            firstName: inputData.fullName,
            lastName: "None",
            address: inputData.address,
            phonenumber: inputData.phonenumber,
            gender: inputData.gender,
            positionId: "P0",
          },
        });
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: {
              patientId: user[0].id,
              timeType: inputData.timeType,
              date: inputData.date,
              statusId: "S1",
            },
            defaults: {
              statusId: "S1",
              doctorId: inputData.doctorId,
              patientId: user[0].id,
              date: inputData.date,
              timeType: inputData.timeType,
              token: token,
              reason: inputData.reason,
            },
          });
        }

        resolve({
          errCode: 0,
          message: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const postVeryfyPatientBookingService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.token || !inputData.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !!",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: inputData.doctorId,
            token: inputData.token,
            statusId: "S1",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            errCode: 0,
            message: "Update appointment succeed!!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment does not exits or has been actived !!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getPatientAppointmentService = (patientId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!patientId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !!",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            patientId: patientId,
          },
          order: [["createdAt", "DESC"]],
          attributes: ["statusId", "doctorId", "patientId", "date", "timeType"],
          include: [
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
            {
              model: db.User,
              as: "bookingDoctorData",
              attributes: ["firstName", "lastName"],
              include: [
                {
                  model: db.Doctor_Info,
                  attributes: ["doctorId"],
                  include: [
                    {
                      model: db.Clinic,
                      as: "doctorClinicData",
                      attributes: ["name", "address"],
                    },
                  ],
                },
              ],
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

const getPatientHistoryService = (patientId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!patientId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !!",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            patientId: patientId,
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

module.exports = {
  savePatientBookingService,
  postVeryfyPatientBookingService,
  getPatientAppointmentService,
  getPatientHistoryService,
};
