import doctorServices from "../services/doctorServices";

let getTopDoctorForHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 8;
  try {
    let response = await doctorServices.getTopDoctorService(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server!!",
    });
  }
};

let getAllDoctors = async (req, res) => {
  try {
    const response = await doctorServices.getAllDoctorsService();
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

const saveInfoDoctor = async (req, res) => {
  try {
    let response = await doctorServices.saveInfoDoctorService(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

const getInfoDoctor = async (req, res) => {
  try {
    let inforDoctor = await doctorServices.getInfoDoctorService(req.query.id);
    return res.status(200).json(inforDoctor);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

const saveCreateSchedule = async (req, res) => {
  try {
    let info = await doctorServices.saveCreateScheduleService(req.body);
    return res.status(200).json(info);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

const getScheduleDoctor = async (req, res) => {
  try {
    let dateArr = await doctorServices.getScheduleDoctorService(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(dateArr);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

const getExtraDoctorInfo = async (req, res) => {
  try {
    let data = await doctorServices.getExtraDoctorInfoService(
      req.query.doctorId
    );
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

const deleteScheduleDoctor = async (req, res) => {
  try {
    let response = await doctorServices.deleteScheduleDoctorService(
      req.body.id
    );
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

const getAppointmentDoctor = async (req, res) => {
  try {
    let data = await doctorServices.getAppointmentDoctorService(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

const getHistoryDoctor = async (req, res) => {
  try {
    let data = await doctorServices.getHistoryDoctorService(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

const sendMailToCus = async (req, res) => {
  try {
    let data = await doctorServices.sendMailToCusService(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};
const confirmAppointmentSucceed = async (req, res) => {
  try {
    let data = await doctorServices.confirmAppointmentSucceedService(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    let data = await doctorServices.cancelAppointmentService(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

module.exports = {
  getTopDoctorForHome,
  getAllDoctors,
  saveInfoDoctor,
  getInfoDoctor,
  saveCreateSchedule,
  getScheduleDoctor,
  getExtraDoctorInfo,
  deleteScheduleDoctor,
  getAppointmentDoctor,
  sendMailToCus,
  confirmAppointmentSucceed,
  cancelAppointment,
  getHistoryDoctor,
};
