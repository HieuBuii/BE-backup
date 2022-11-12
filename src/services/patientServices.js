import db from "../models/index";
require("dotenv").config();
import mailServices from "./mailServices";
import { v4 as uuidv4 } from "uuid";

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

module.exports = {
  savePatientBookingService,
  postVeryfyPatientBookingService,
};
