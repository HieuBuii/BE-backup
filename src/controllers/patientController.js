import patientServices from "../services/patientServices";

const savePatientBooking = async (req, res) => {
  try {
    let response = await patientServices.savePatientBookingService(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

const postVeryfyPatientBooking = async (req, res) => {
  try {
    let response = await patientServices.postVeryfyPatientBookingService(
      req.body
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

const getPatientAppointment = async (req, res) => {
  try {
    let data = await patientServices.getPatientAppointmentService(
      req.query.patientId
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

const getPatientHistory = async (req, res) => {
  try {
    let data = await patientServices.getPatientHistoryService(
      req.query.patientId
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

module.exports = {
  savePatientBooking,
  postVeryfyPatientBooking,
  getPatientAppointment,
  getPatientHistory,
};
