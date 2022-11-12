import handBookService from "../services/handBookService";

const createHandBook = async (req, res) => {
  try {
    let response = await handBookService.createHandBookService(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

let getAllHandBook = async (req, res) => {
  try {
    let response = await handBookService.getAllHandBookService();
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server!!",
    });
  }
};

const editHandBook = async (req, res) => {
  try {
    let response = await handBookService.editHandBookService(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

const deleteHandBook = async (req, res) => {
  try {
    let response = await handBookService.deleteHandBookService(req.body.id);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !!",
    });
  }
};

let getHandBookById = async (req, res) => {
  try {
    let response = await handBookService.getHandBookByIdService(
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
  createHandBook,
  getAllHandBook,
  editHandBook,
  deleteHandBook,
  getHandBookById,
};
