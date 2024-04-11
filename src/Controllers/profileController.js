class ProfileController {
  static async getActualUserData(req, res) {
    const profile = req.profile;
    res.status(200).json(profile);
  }
}

module.exports = {
  ProfileController,
};
