import db from "../models/index";
require("dotenv").config();
import mailServices from "./mailServices";
import { v4 as uuidv4 } from "uuid";
import _, { reject } from "lodash";
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
        // let user = await db.User.findOne({
        //   where: { email: inputData.email },
        // });

        // if (user) {
        //   await db.Booking.findOrCreate({
        //     where: {
        //       patientId: user.id,
        //       // timeType: inputData.timeType,
        //       date: inputData.date,
        //       statusId: { [Op.or]: ["S1", "S2", "S3", "S5"] },
        //     },
        //     defaults: {
        //       statusId: "S1",
        //       doctorId: inputData.doctorId,
        //       patientId: user.id,
        //       date: inputData.date,
        //       timeType: inputData.timeType,
        //       token: token,
        //       reason: inputData.reason,
        //     },
        //   });
        // } else {
        //   resolve({
        //     errCode: 2,
        //     message: "User not found !!",
        //   });
        // }

        let token = uuidv4();
        let user = await db.User.findOne({
          where: { email: inputData.email },
        });

        if (user) {
          let bookings = await db.Booking.findAll({
            where: {
              patientId: user.id,
              date: inputData.date,
              statusId: { [Op.or]: ["S1", "S2", "S3", "S5"] },
            },
          });
          if (!bookings || _.isEmpty(bookings)) {
            await db.Booking.create({
              statusId: "S1",
              doctorId: inputData.doctorId,
              patientId: user.id,
              date: inputData.date,
              timeType: inputData.timeType,
              token: token,
              reason: inputData.reason,
            });

            await mailServices.sendEmailConfirmBooking({
              email: inputData.email,
              fullName: inputData.fullName,
              timeString: inputData.timeString,
              doctorName: inputData.doctorName,
              link: buildURLVerifyEmail(inputData.doctorId, token),
              language: inputData.language,
            });
          } else {
            resolve({
              errCode: 2,
              message: "On day is already exits appoinment !!",
            });
          }
        } else {
          resolve({
            errCode: 2,
            message: "User not found !!",
          });
        }

        //send Mail confirm
        // let token = uuidv4();
        // await mailServices.sendEmailConfirmBooking({
        //   email: inputData.email,
        //   fullName: inputData.fullName,
        //   timeString: inputData.timeString,
        //   doctorName: inputData.doctorName,
        //   link: buildURLVerifyEmail(inputData.doctorId, token),
        //   language: inputData.language,
        // });

        // let user = await db.User.findOrCreate({
        //   where: { email: inputData.email },
        //   defaults: {
        //     email: inputData.email,
        //     roleId: "R3",
        //     firstName: inputData.fullName,
        //     lastName: "None",
        //     address: inputData.address,
        //     phonenumber: inputData.phonenumber,
        //     gender: inputData.gender,
        //     positionId: "P0",
        //   },
        // });

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
          attributes: [
            "statusId",
            "doctorId",
            "patientId",
            "date",
            "timeType",
            "id",
          ],
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

const postRatingService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.patientId ||
        !inputData.doctorId ||
        !inputData.bookingId ||
        !inputData.rating
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !!",
        });
      } else {
        await db.Rating.create({
          patientId: inputData.patientId,
          doctorId: inputData.doctorId,
          bookingId: inputData.bookingId,
          rating: inputData.rating,
          comment: inputData.comment,
        });

        let doctorInfo = await db.Doctor_Info.findOne({
          where: { doctorId: inputData.doctorId },
          raw: false,
        });
        if (doctorInfo) {
          doctorInfo.count = +doctorInfo.count + 1;
          doctorInfo.total = +doctorInfo.total + inputData.rating;

          await doctorInfo.save();
        }

        let booking = await db.Booking.findOne({
          where: { id: inputData.bookingId },
          raw: false,
        });
        if (booking) {
          booking.statusId = "S5";

          await booking.save();
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

const getRatingService = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter !!",
        });
      } else {
        let rating = await db.Rating.findAll({
          where: { doctorId: doctorId },
          order: [["createdAt", "DESC"]],
          attributes: ["rating", "comment"],
          include: [
            {
              model: db.User,
              as: "ratingDoctor",
              attributes: ["id"],
              include: [
                {
                  model: db.Doctor_Info,
                  attributes: ["total", "count"],
                },
              ],
            },
            {
              model: db.User,
              as: "ratingPatient",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (rating) {
          resolve({
            errCode: 0,
            data: rating,
          });
        } else {
          resolve({
            errCode: 2,
            message: "Not found !!",
          });
        }
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
  postRatingService,
  getRatingService,
};
