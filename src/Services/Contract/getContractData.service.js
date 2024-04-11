const { Op } = require("sequelize");
const { Job } = require("../../model");

class GetContractDataUseCase {
  //base entry points: params, options
  static async handle({ profile, contractId }, { app }) {
    const { Contract: cContext } = app.get("models");
    const { id, type } = profile;

    const clientTypeOption = type === "client" ? { ClientId: id } : { ContractorId: id };

    const contract = await cContext.findOne({
      where: { [Op.and]: [{ id: contractId }, clientTypeOption] },
      include: {
        model: Job,
        as: "Jobs",
      },
    });

    return contract ? [contract] : [];
  }
}

module.exports = {
  GetContractDataUseCase,
};
