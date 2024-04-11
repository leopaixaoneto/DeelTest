const { doDepositUseCase } = require("../Services/Balance/doDepositBalance.service");

class BalanceController {
  static async deposit(req, res) {
    const profile = req.profile;
    const { userId } = req.params;

    const payload = { ...req.body, userId };
    const result = await doDepositUseCase.handle({ profile, payload }, { app: req.app });

    const statusCode = result.success ? 200 : 400;

    res.status(statusCode).json({
      data: [],
      message: result.message,
    });
  }
}

module.exports = {
  BalanceController,
};
