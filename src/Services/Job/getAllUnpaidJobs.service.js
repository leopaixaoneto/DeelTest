const { Op } = require("sequelize");
const { Contract } = require("../../model.js");

class GetAllUnpaidJobsUseCase {
  //base entry points: params, options
  static async handle({ profile }, { app }) {
    const { Job } = app.get("models");
    const { id, type } = profile;

    const clientTypeOption =
      type === "client" ? { "$Contract.ClientId$": id } : { "$Contract.ContractorId$": id };

    const unpaidJobs = await Job.findAll({
      where: {
        [Op.and]: [{ paid: false }, { "$Contract.status$": "in_progress" }, clientTypeOption],
      },
      include: [
        {
          model: Contract,
          as: "Contract",
          // attributes: [],
        },
      ],
    });

    return unpaidJobs ? unpaidJobs : null;
  }
}

module.exports = {
  GetAllUnpaidJobsUseCase,
};
