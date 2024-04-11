const { GetAllUnpaidJobsUseCase } = require("../Services/Job/getAllUnpaidJobs.service");
const { PayJobUseCase } = require("../Services/Job/payJob.service");

class JobController {
  static async getAllUpaidJobs(req, res) {
    const profile = req.profile;

    const result = await GetAllUnpaidJobsUseCase.handle({ profile }, { app: req.app });

    res.status(200).json({
      data: result,
    });
  }

  static async payJob(req, res) {
    const profile = req.profile;
    const { jobId } = req.params;

    const result = await PayJobUseCase.handle({ profile, jobId }, { app: req.app });

    const statusCode = result.success ? 200 : 400;

    res.status(statusCode).json({
      data: [],
      message: result.message,
    });
  }
}

module.exports = {
  JobController,
};
