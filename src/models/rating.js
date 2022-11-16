"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rating.belongsTo(models.User, {
        foreignKey: "doctorId",
        targetKey: "id",
        as: "ratingDoctor",
      });
      Rating.belongsTo(models.User, {
        foreignKey: "patientId",
        targetKey: "id",
        as: "ratingPatient",
      });
    }
  }
  Rating.init(
    {
      bookingId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      patientId: DataTypes.INTEGER,
      rating: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Rating",
    }
  );
  return Rating;
};
