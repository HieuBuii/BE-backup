"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor_Intro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Doctor_Intro.belongsTo(models.User, { foreignKey: "doctorId" });
    }
  }
  Doctor_Intro.init(
    {
      contentHTML: DataTypes.TEXT("long"),
      contentMarkdown: DataTypes.TEXT("long"),
      description: DataTypes.TEXT("long"),
      doctorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Doctor_Intro",
      freezeTableName: true,
    }
  );
  return Doctor_Intro;
};
