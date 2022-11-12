"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        email: "example@example.com",
        password: "12345",
        firstName: "John",
        lastName: "Doe",
        address: "Ha Noi",
        phonenumber: "012345678",
        gender: 1,
        image: "DataTypes.STRING",
        roleId: "R1",
        positionId: "S2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
