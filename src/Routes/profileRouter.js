const { ProfileController } = require("../Controllers/profileController");
const { getProfile } = require("../middleware/getProfile");

const express = require("express");
const router = express.Router();

class ProfileRouter {
  static generate() {
    /**
     * Get actual user data
     *
     * @returns logged user data
     */
    router.get("/", getProfile, ProfileController.getActualUserData);

    return router;
  }
}

module.exports = {
  ProfileRouter,
};
