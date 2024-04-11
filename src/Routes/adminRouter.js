const { AdminController } = require("../Controllers/adminController.js");
const { getProfile } = require("../middleware/getProfile");
const { isAdmin } = require("../middleware/isAdmin.js");

const express = require("express");
const router = express.Router();

class AdminRouter {
  static generate() {
    /**
     * Calculate the most paid profession
     *
     * @query start {Date}
     * @query end {Date}
     *
     * @returns the result of the deposit try
     */
    router.get("/best-profession", getProfile, isAdmin, AdminController.getMostPaidProfession);

    /**
     * Calculate the client which are the biggest payeer
     *
     * @query start {Date}
     * @query end {Date}
     * @query limit {number}
     * @returns return the top Limit payeer users
     */
    router.get("/best-clients", getProfile, isAdmin, AdminController.getBiggestPayeerClient);

    return router;
  }
}

module.exports = {
  AdminRouter,
};
