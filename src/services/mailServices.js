const dotenv = require("dotenv").config();
import nodemailer from "nodemailer";

const sendEmailConfirmBooking = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_USER_NAME, // generated ethereal user
      pass: process.env.GMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Health Care" <bt.hieuBVT145@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Xác minh đặt lịch khám bệnh ✔", // Subject line
    html: buildContentEmail(dataSend),
  });
};

const buildContentEmail = (dataSend) => {
  let content = "";
  if (dataSend.language === "vi") {
    content = `<h3>Xin chào ${dataSend.fullName}</h3>
    <p>Bạn nhận được Email này bởi vì chúng tôi nhận thấy bạn đã tiến hành đặt lịch khám bệnh trên trang web
    Heath Care.</p>
    <p>Thông tin lịch đã đặt:</p>
    <ul>
        <li><b>Thời gian: ${dataSend.timeString}.</b></li>
        <li><b>Bác sĩ: ${dataSend.doctorName}.</b></li>
    </ul>
    <p>Nếu các thông tin trên là đúng, vui lòng nhấn vào đường link bên dưới để xác nhận và hoàn tất đăt lịch khám bệnh.</p>
    <a href= ${dataSend.link} target="_blank">Click here</a>
    <p>Xin cảm ơn quý khách vì đã lựa chọn sử dụng dịch vụ của Heath Care ♥♥</p>
`;
  }
  if (dataSend.language === "en") {
    content = `<h3>Dear ${dataSend.fullName}!</h3>
    <p>You received this Email because we noticed that you have already booked a medical appointment on the website
    Heath Care.</p>
    <p>Scheduled information:</p>
    <ul>
        <li><b>Time: ${dataSend.timeString}.</b></li>
        <li><b>Doctor: ${dataSend.doctorName}.</b></li>
    </ul>
    <p>If the above information is correct, please click on the link below to confirm and complete the appointment.</p>
    <a href= ${dataSend.link} target="_blank">Click here</a>
    <p>Thank you for choosing to use Heath Care's services ♥♥</p>
`;
  }
  return content;
};

const sendEmailConfirmForgotPW = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_USER_NAME, // generated ethereal user
      pass: process.env.GMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Health Care" <bt.hieuBVT145@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Xác minh quên mật khẩu ✔", // Subject line
    html: buildContentEmailForgot(dataSend),
  });
};

const buildContentEmailForgot = (dataSend) => {
  let content = `<h3>Xin chào ${dataSend.firstName}</h3>
    <p>Bạn nhận được Email này bởi vì chúng tôi nhận thấy bạn đã tiến hành yêu cầu quên mật khẩu trên trang web
    Heath Care.</p>
    <p>Nếu thông tin trên là đúng, vui lòng nhấn vào đường link bên dưới để xác nhận và hoàn tất đặt lại mật khẩu.</p>
    <a href= ${dataSend.link} target="_blank">Click here</a>
    <p>Xin cảm ơn quý khách vì đã lựa chọn sử dụng dịch vụ của Heath Care ♥♥</p>
`;
  return content;
};

const sendEmailGiveNewPW = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_USER_NAME, // generated ethereal user
      pass: process.env.GMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Health Care" <bt.hieuBVT145@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Mật khẩu mới ✔", // Subject line
    html: buildContentGiveNewPW(dataSend),
  });
};

const buildContentGiveNewPW = (dataSend) => {
  let content = `<h3>Xin chào ${dataSend.firstName}</h3>
    <p>Bạn nhận được Email này bởi vì chúng tôi nhận thấy bạn đã tiến hành xác thực yêu cầu quên mật khẩu trên trang web
    Heath Care.</p>
    <p>Mật khẩu mới của bạn là:.</p>
    <p><b>${dataSend.randomPW}</b></p>
    <p>Xin cảm ơn quý khách vì đã lựa chọn sử dụng dịch vụ của Heath Care ♥♥</p>
`;
  return content;
};

const sendEmailToCustomer = async (dataSend) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_USER_NAME, // generated ethereal user
      pass: process.env.GMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Health Care" <bt.hieuBVT145@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Về lịch hẹn khám bệnh ✔", // Subject line
    html: buildContentsendEmailToCustomer(dataSend),
    attachments: [
      {
        filename: "Dinhkem.png",
        content: dataSend.file.split("base64,")[1],
        encoding: "base64",
      },
    ],
  });
};

const buildContentsendEmailToCustomer = (dataSend) => {
  let content = `<h3>Xin chào ${dataSend.fullNamePatient}</h3>
    <p>Về lịch hẹn khám bệnh:</p>
    <ul>
        <li><b>Ngày: ${dataSend.dateAppointment}.</b></li>
        <li><b>Thời gian: ${dataSend.timeAppointment}.</b></li>
        <li><b>Doctor: ${dataSend.nameDoctor}.</b></li>
    </ul>
    </br>
    <p>Lời nhắn của bác sĩ và thông tin bổ sung kèm theo trong file đính kèm:</p>
    <p>${dataSend.message}</p>
`;
  return content;
};

module.exports = {
  sendEmailConfirmBooking,
  sendEmailConfirmForgotPW,
  sendEmailGiveNewPW,
  sendEmailToCustomer,
};
