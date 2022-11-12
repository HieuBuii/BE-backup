import specialtyServices from "../services/specialtyServices";

const createSpecialty = async (req, res) => {
  try {
    let response = await specialtyServices.createSpecialtyService(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

let getAllSpecialy = async (req, res) => {
  try {
    let response = await specialtyServices.getAllSpecialyService();
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server!!",
    });
  }
};

const editSpecialty = async (req, res) => {
  try {
    let response = await specialtyServices.editSpecialtyService(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

const deleteSpecialty = async (req, res) => {
  try {
    let response = await specialtyServices.deleteSpecialtyService(req.body.id);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

let getSpecialyById = async (req, res) => {
  try {
    let response = await specialtyServices.getSpecialyByIdService(
      req.query.id,
      req.query.location
    );
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
  createSpecialty,
  getAllSpecialy,
  editSpecialty,
  deleteSpecialty,
  getSpecialyById,
};
