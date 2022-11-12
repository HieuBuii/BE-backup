import clinicServices from "../services/clinicServices";

const createClinic = async (req, res) => {
  try {
    let response = await clinicServices.createClinicService(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

let getAllClinic = async (req, res) => {
  try {
    let response = await clinicServices.getAllClinicService();
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server!!",
    });
  }
};

const editClinic = async (req, res) => {
  try {
    let response = await clinicServices.editClinicService(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

const deleteClinic = async (req, res) => {
  try {
    let response = await clinicServices.deleteClinicService(req.body.id);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

let getClinicById = async (req, res) => {
  try {
    let response = await clinicServices.getClinicByIdService(req.query.id);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server!!",
    });
  }
};

module.exports = {
  createClinic,
  getAllClinic,
  editClinic,
  deleteClinic,
  getClinicById,
};
