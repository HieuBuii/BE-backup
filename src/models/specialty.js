"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Specialty.hasMany(models.Doctor_Info, {
        foreignKey: "specialtyId",
        as: "doctorInfoData",
      });
    }
  }
  Specialty.init(
    {
      nameVi: DataTypes.STRING,
      nameEn: DataTypes.STRING,
      image: DataTypes.TEXT,
      contentHTML: DataTypes.TEXT,
      contentMarkdown: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Specialty",
    }
  );
  return Specialty;
};
