import db from "../models/index";
import CRUDService from "../services/CRUDservices";

const getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homePage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

const getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

const postCRUD = async (req, res) => {
  await CRUDService.creatNewUser(req.body);
  let data = await CRUDService.getUser(req.body);
  return res.render("displayCRUD.ejs", { data: data });
};

const displayGetCRUD = async (req, res) => {
  let data = await CRUDService.getUser(req.body);
  return res.render("displayCRUD.ejs", { data: data });
};

const getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let data = await CRUDService.editUser(userId);
    return res.render("editCRUD.ejs", { data: data });
  } else {
    return res.send("User not found");
  }
};

const putEditCRUD = async (req, res) => {
  let data = req.body;
  let users = await CRUDService.putUser(data);
  return res.render("displayCRUD.ejs", { data: users });
};

let deleteCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let users = await CRUDService.deleteUserCRUD(userId);
    return res.render("displayCRUD.ejs", { data: users });
  } else {
    res.send("user not found");
  }
};

export default {
  getHomePage: getHomePage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putEditCRUD: putEditCRUD,
  deleteCRUD: deleteCRUD,
};
