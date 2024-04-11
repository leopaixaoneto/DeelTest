const {
  CalculateMostPaidProfessionUseCase,
} = require("../Services/Admin/calculateMostPaidProfession.service.js");

const {
  CalculateBestPayeerClientUseCase,
} = require("../Services/Admin/calculateBestPayeerClient.service.js");

class AdminController {
  //Calculate the most paid profession in some Date range
  static async getMostPaidProfession(req, res) {
    const { start, end } = req.query;

    if (!start || !end)
      return res
        .status(400)
        .json({ message: "You need to pass start and end query params for this endpoint" });

    //add some validations for start and end to be real and valid dates

    const result = await CalculateMostPaidProfessionUseCase.handle(
      { start: new Date(start), end: new Date(end) },
      { app: req.app }
    );

    const { success, ...rest } = result;
    const status = success ? 200 : 400;

    res.status(status).json(rest);
  }

  //Calculate the client with the biggest paid sum in some Date range
  static async getBiggestPayeerClient(req, res) {
    const { start, end, limit = 2 } = req.query;

    if (!start || !end)
      return res
        .status(400)
        .json({ message: "You need to pass start, end query params for this endpoint" });

    const result = await CalculateBestPayeerClientUseCase.handle(
      { start, end, limit },
      { app: req.app }
    );

    const { success, ...rest } = result;
    const status = success ? 200 : 400;

    res.status(status).json(rest);
  }
}

module.exports = {
  AdminController,
};
